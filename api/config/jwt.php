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

        // 1. Check HttpOnly Cookie
        if (isset($_COOKIE['admin_token']) && !empty($_COOKIE['admin_token'])) {
            $token = $_COOKIE['admin_token'];
        } elseif (isset($_COOKIE['user_token']) && !empty($_COOKIE['user_token'])) {
            $token = $_COOKIE['user_token'];
        }

        // 2. Check Authorization Header
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));

        if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if (!$token || $token === 'null' || $token === 'undefined') {
            return null;
        }

        return self::verifyToken($token);
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

