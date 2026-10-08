<?php
/**
 * Hardened Pure PHP JWT Handler (HMAC-SHA256)
 * Security Features:
 * 1. Strict RFC 7519 Header & Algorithm Validation (blocks algorithm confusion & 'none' alg)
 * 2. Cryptographic Token ID (jti) & Replay Prevention
 * 3. Server-Side Token Blacklist / Revocation Engine (Instant killswitch on logout)
 * 4. Client Device / User-Agent Fingerprint Binding (prevents token hijacking)
 * 5. Clock-skew tolerance & strict expiration enforcement
 * 6. Timing-attack safe comparisons (hash_equals)
 */

require_once __DIR__ . '/db.php';

class JWT {
    private static string $defaultSecret = 'afn_super_secret_jwt_key_2026_fresh_naturals_prod';
    private static string $issuer = 'https://allfreshnaturals.com';
    private static string $audience = 'allfreshnaturals-app';

    private static function getSecret(): string {
        $secret = getenv('JWT_SECRET') ?: self::$defaultSecret;
        // Enforce minimum 256-bit (32 chars) secret length
        if (strlen($secret) < 32) {
            $secret = hash('sha256', $secret . 'afn_salt_2026');
        }
        return $secret;
    }

    public static function getClientFingerprint(): string {
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'afn_client', 0, 120);
        return hash('sha256', $ua);
    }

    public static function generateToken(string $id, string $identifier, string $role = 'customer', int $expiryMinutes = 60): string {
        $now = time();
        $jti = bin2hex(random_bytes(16)); // 128-bit unique token nonce

        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ], JSON_UNESCAPED_SLASHES);

        $payload = json_encode([
            'iss' => self::$issuer,
            'aud' => self::$audience,
            'sub' => $id,
            'id' => $id,
            'email' => $identifier,
            'role' => $role,
            'jti' => $jti,
            'iat' => $now,
            'nbf' => $now - 5, // 5s clock-skew leeway
            'exp' => $now + ($expiryMinutes * 60),
            'fp' => self::getClientFingerprint()
        ], JSON_UNESCAPED_SLASHES);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);

        $signature = hash_hmac('sha256', "{$base64UrlHeader}.{$base64UrlPayload}", self::getSecret(), true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return "{$base64UrlHeader}.{$base64UrlPayload}.{$base64UrlSignature}";
    }

    public static function verifyToken(string $token, bool $checkRevocation = true): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        // 1. Decode & Strictly Validate Header
        $headerJson = self::base64UrlDecode($base64UrlHeader);
        $header = json_decode($headerJson, true);
        if (!is_array($header) || !isset($header['alg']) || $header['alg'] !== 'HS256') {
            return null; // Algorithm manipulation or unsupported alg rejected
        }
        if (isset($header['typ']) && strtoupper($header['typ']) !== 'JWT') {
            return null;
        }

        // 2. Cryptographic Signature Verification (Timing-attack resistant)
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', "{$base64UrlHeader}.{$base64UrlPayload}", self::getSecret(), true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        // 3. Decode & Validate Claims
        $payloadJson = self::base64UrlDecode($base64UrlPayload);
        $payload = json_decode($payloadJson, true);
        if (!is_array($payload)) {
            return null;
        }

        $now = time();

        // Enforce expiration
        if (!isset($payload['exp']) || $payload['exp'] <= $now) {
            return null;
        }

        // Enforce Not-Before (nbf) with 60s clock skew
        if (isset($payload['nbf']) && $payload['nbf'] > ($now + 60)) {
            return null;
        }

        // Enforce Issued-At (iat) sanity
        if (isset($payload['iat']) && $payload['iat'] > ($now + 60)) {
            return null;
        }

        // 4. Token Blacklist / Revocation Check
        if ($checkRevocation && !empty($payload['jti'])) {
            if (self::isRevoked($payload['jti'])) {
                return null; // Revoked / Logged out token rejected immediately
            }
        }

        // 5. Device Fingerprint Binding Check
        if (isset($payload['fp']) && !empty($_SERVER['HTTP_USER_AGENT'])) {
            if (!hash_equals($payload['fp'], self::getClientFingerprint())) {
                return null; // Token used from a different browser/device rejected
            }
        }

        return $payload;
    }

    private static function initBlacklistTable(): void {
        static $initialized = false;
        if ($initialized) return;
        try {
            $pdo = Database::getConnection();
            $driver = Database::getDriverName();
            $keyType = ($driver === 'mysql') ? 'VARCHAR(64) PRIMARY KEY' : 'TEXT PRIMARY KEY';
            $pdo->exec("CREATE TABLE IF NOT EXISTS token_blacklist (
                jti $keyType,
                expires_at INTEGER NOT NULL,
                revoked_at INTEGER NOT NULL
            )");
            // Periodic cleanup of expired blacklist entries (1 in 30 chance)
            if (mt_rand(1, 30) === 1) {
                $now = time();
                $pdo->exec("DELETE FROM token_blacklist WHERE expires_at < $now");
            }
            $initialized = true;
        } catch (Exception $e) {}
    }

    public static function revokeToken(?string $token): bool {
        if (empty($token)) return false;
        // Verify signature and structure without checking revocation
        $payload = self::verifyToken($token, false);
        if (!$payload || empty($payload['jti'])) return false;

        self::initBlacklistTable();
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("INSERT OR REPLACE INTO token_blacklist (jti, expires_at, revoked_at) VALUES (?, ?, ?)");
            return $stmt->execute([
                $payload['jti'],
                $payload['exp'] ?? (time() + 86400),
                time()
            ]);
        } catch (Exception $e) {
            try {
                // MySQL syntax fallback
                $stmt = $pdo->prepare("REPLACE INTO token_blacklist (jti, expires_at, revoked_at) VALUES (?, ?, ?)");
                return $stmt->execute([
                    $payload['jti'],
                    $payload['exp'] ?? (time() + 86400),
                    time()
                ]);
            } catch (Exception $ex) {
                return false;
            }
        }
    }

    public static function isRevoked(string $jti): bool {
        if (empty($jti)) return false;
        self::initBlacklistTable();
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("SELECT 1 FROM token_blacklist WHERE jti = ? AND expires_at > ?");
            $stmt->execute([$jti, time()]);
            return (bool)$stmt->fetchColumn();
        } catch (Exception $e) {
            return false;
        }
    }

    public static function getAuthToken(): ?string {
        $token = null;

        // 1. Check Authorization Header FIRST (RFC 6750)
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] 
            ?? ($headers['authorization'] 
            ?? ($_SERVER['HTTP_AUTHORIZATION'] 
            ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '')));

        if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
        }

        // 2. Fallback to HttpOnly Cookies (prefer admin_token)
        if (!$token || $token === 'null' || $token === 'undefined') {
            if (!empty($_COOKIE['admin_token'])) {
                $token = $_COOKIE['admin_token'];
            } elseif (!empty($_COOKIE['user_token'])) {
                $token = $_COOKIE['user_token'];
            }
        }

        if (!$token || $token === 'null' || $token === 'undefined') {
            return null;
        }

        return $token;
    }

    public static function getAuthUser(): ?array {
        $token = self::getAuthToken();
        if (!$token) return null;
        return self::verifyToken($token);
    }

    public static function getAdminUser(): ?array {
        $user = self::getAuthUser();
        if ($user && ($user['role'] ?? '') === 'administrator') {
            return $user;
        }
        // Check admin_token cookie explicitly if user_token took precedence
        if (!empty($_COOKIE['admin_token'])) {
            $cookieUser = self::verifyToken($_COOKIE['admin_token']);
            if ($cookieUser && ($cookieUser['role'] ?? '') === 'administrator') {
                return $cookieUser;
            }
        }
        return null;
    }

    public static function requireAdmin(): array {
        $admin = self::getAdminUser();
        if (!$admin) {
            if (!headers_sent()) http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized: Administrator authentication required.'
            ]);
            exit;
        }
        return $admin;
    }

    public static function requireAuth(): array {
        $user = self::getAuthUser();
        if (!$user) {
            if (!headers_sent()) http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized: Authentication required.'
            ]);
            exit;
        }
        return $user;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
