<?php
/**
 * All Fresh Naturals - Lightweight Database Rate Limiter
 * Protects login, admin auth, and OTP endpoints from brute force attacks
 */

require_once __DIR__ . '/db.php';

class RateLimiter {
    public static function getClientIp(): string {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] 
           ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
           ?? $_SERVER['REMOTE_ADDR'] 
           ?? '0.0.0.0';
        
        if (strpos($ip, ',') !== false) {
            $parts = explode(',', $ip);
            $ip = trim($parts[0]);
        }
        return preg_replace('/[^a-fA-F0-9:.]/', '', $ip);
    }

    private static function initTable(): void {
        static $initialized = false;
        if ($initialized) return;
        try {
            $pdo = Database::getConnection();
            $driver = Database::getDriverName();
            $keyType = ($driver === 'mysql') ? 'VARCHAR(190) PRIMARY KEY' : 'TEXT PRIMARY KEY';
            $pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (
                action_key $keyType,
                attempts INTEGER DEFAULT 1,
                first_attempt INTEGER,
                last_attempt INTEGER
            )");
            // Automatically purge stale rate limit records older than 24 hours
            $oneDayAgo = time() - 86400;
            $pdo->exec("DELETE FROM rate_limits WHERE last_attempt < $oneDayAgo");
            $initialized = true;
        } catch (Exception $e) {}
    }

    /**
     * Check if client is allowed to proceed.
     * Returns true if allowed, false if blocked.
     */
    public static function check(string $action, string $identifier, int $maxAttempts, int $decaySeconds): bool {
        self::initTable();
        try {
            $pdo = Database::getConnection();
            $key = $action . ':' . md5($identifier);
            $now = time();

            $stmt = $pdo->prepare("SELECT attempts, first_attempt, last_attempt FROM rate_limits WHERE action_key = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return true;
            }

            // If the decay window has expired, reset
            if (($now - (int)$row['first_attempt']) > $decaySeconds) {
                self::clear($action, $identifier);
                return true;
            }

            return ((int)$row['attempts']) < $maxAttempts;
        } catch (Exception $e) {
            return true; // Fail open on db error to avoid blocking legitimate users
        }
    }

    /**
     * Record a hit/attempt.
     */
    public static function hit(string $action, string $identifier, int $decaySeconds): void {
        self::initTable();
        try {
            $pdo = Database::getConnection();
            $key = $action . ':' . md5($identifier);
            $now = time();

            $stmt = $pdo->prepare("SELECT attempts, first_attempt FROM rate_limits WHERE action_key = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row || ($now - (int)$row['first_attempt']) > $decaySeconds) {
                $del = $pdo->prepare("DELETE FROM rate_limits WHERE action_key = ?");
                $del->execute([$key]);
                $ins = $pdo->prepare("INSERT INTO rate_limits (action_key, attempts, first_attempt, last_attempt) VALUES (?, 1, ?, ?)");
                $ins->execute([$key, $now, $now]);
            } else {
                $upd = $pdo->prepare("UPDATE rate_limits SET attempts = attempts + 1, last_attempt = ? WHERE action_key = ?");
                $upd->execute([$now, $key]);
            }
        } catch (Exception $e) {}
    }

    /**
     * Clear / reset attempts upon successful action.
     */
    public static function clear(string $action, string $identifier): void {
        self::initTable();
        try {
            $pdo = Database::getConnection();
            $key = $action . ':' . md5($identifier);
            $stmt = $pdo->prepare("DELETE FROM rate_limits WHERE action_key = ?");
            $stmt->execute([$key]);
        } catch (Exception $e) {}
    }
}
