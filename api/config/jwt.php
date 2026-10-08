<?php
/**
 * Lightweight Pure PHP JWT Handler (HMAC-SHA256)
 */

class JWT {
    private static string $defaultSecret = 'afn_super_secret_jwt_key_2026_fresh_naturals_prod';

    private static function getSecret(): string {
        return getenv('JWT_SECRET') ?: self::$defaultSecret;
    }

    public static function generateToken(string $id, string $identifier, string $role = 'customer', int $expiryMinutes = 60): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'id' => $id,
            'email' => $identifier,
            'role' => $role,
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

