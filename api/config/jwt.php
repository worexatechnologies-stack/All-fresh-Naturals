<?php
/**
 * Lightweight Pure PHP JWT Handler (HMAC-SHA256)
 */

class JWT {
    private static function getSecret(): string {
        $envSecret = getenv('JWT_SECRET');
        if (!empty($envSecret) && strlen($envSecret) >= 32 && $envSecret !== 'afn_super_secret_jwt_key_2026_fresh_naturals_prod') {
            return $envSecret;
        }

        // Dynamically persist a cryptographically secure random secret if none is configured
        $secretFile = __DIR__ . '/../data/.jwt_secret';
        if (file_exists($secretFile)) {
            $secret = trim((string)file_get_contents($secretFile));
            if (strlen($secret) >= 32) return $secret;
        }

        try {
            $randomKey = bin2hex(random_bytes(32));
            @file_put_contents($secretFile, $randomKey);
            return $randomKey;
        } catch (Exception $e) {
            return hash('sha256', __DIR__ . 'fresh_naturals_unique_prod_salt_2026');
        }
    }

    private static function getClientFingerprint(): string {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'default_ua';
        return substr(hash('sha256', $ua), 0, 16);
    }

    public static function generateToken(string $id, string $identifier, string $role = 'customer', int $expiryMinutes = 60): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'id' => $id,
            'email' => $identifier,
            'role' => $role,
            'fp' => self::getClientFingerprint(),
            'iat' => time(),
            'exp' => time() + ($expiryMinutes * 60)
        ]);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::getSecret(), true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::getSecret(), true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        // Verify device/browser fingerprint if present
        if (isset($payload['fp']) && !empty($_SERVER['HTTP_USER_AGENT'])) {
            if (!hash_equals((string)$payload['fp'], self::getClientFingerprint())) {
                return null;
            }
        }

        return $payload;
    }

    public static function getAuthUser(): ?array {
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

