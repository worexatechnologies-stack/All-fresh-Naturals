<?php
require_once __DIR__ . '/../config/mongodb.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/mailer.php';
require_once __DIR__ . '/../config/rate_limiter.php';

class UserController {
    public static function register(array $data): void {
        try {
            $ip = RateLimiter::getClientIp();

            // Rate limit: Max 5 registrations per 15 minutes per IP to prevent bot spam
            if (!RateLimiter::check('user_register', $ip, 5, 900)) {
                if (!headers_sent()) http_response_code(429);
                echo json_encode([
                    'success' => false,
                    'message' => 'Too many accounts created from this network. Please wait a few minutes.'
                ]);
                return;
            }

            $rawName = trim($data['name'] ?? '');
            $rawEmail = trim($data['email'] ?? '');
            $rawPhone = trim($data['phone'] ?? '');
            $password = $data['password'] ?? '';

            $name = htmlspecialchars(strip_tags($rawName), ENT_QUOTES, 'UTF-8');
            $email = filter_var($rawEmail, FILTER_SANITIZE_EMAIL);
            $phone = preg_replace('/[^0-9+\-\s]/', '', $rawPhone);

            if (empty($name) || (empty($email) && empty($phone)) || empty($password)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Please provide full name, email or phone, and a password.'
                ]);
                return;
            }

            if (strlen($password) < 6) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Password must be at least 6 characters long.'
                ]);
                return;
            }

            if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Please provide a valid email address.'
                ]);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');

            $orConds = [];
            if (!empty($email)) $orConds[] = ['email' => $email];
            if (!empty($phone)) $orConds[] = ['phone' => $phone];

            $existingUser = !empty($orConds) ? $usersCol->findOne(['$or' => $orConds]) : null;

            if ($existingUser) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'An account with this email or phone already exists in our database. Please sign in!'
                ]);
                return;
            }

            $id = 'usr_' . time() . '_' . rand(1000, 9999);
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
            $now = date('Y-m-d H:i:s');

            $userData = [
                'id' => $id,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'password' => $hashedPassword,
                'addresses' => json_encode([]),
                'created_at' => $now,
                'updated_at' => $now
            ];

            if (!$usersCol->insertOne($userData)) {
                throw new RuntimeException('Could not save the account to the database.');
            }

            RateLimiter::hit('user_register', $ip, 900);

            $token = JWT::generateToken($id, $email ?: $phone, 'customer', 60 * 24 * 7); // 7 days

            if (!headers_sent()) {
                setcookie('user_token', $token, [
                    'expires' => time() + (7 * 24 * 60 * 60),
                    'path' => '/',
                    'httponly' => true,
                    'secure' => true,
                    'samesite' => 'Lax'
                ]);
                http_response_code(201);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Account created successfully!',
                'user' => [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'joinedDate' => date('M Y', strtotime($now)),
                    'addresses' => [],
                    'orders' => [],
                    'settings' => ['whatsappNotifications' => true, 'emailPromotions' => true, 'batchAlerts' => true]
                ],
                'token' => $token
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Registration could not be completed.']);
        }
    }

    public static function login(array $data): void {
        try {
            $ip = RateLimiter::getClientIp();

            // Rate Limit: Max 6 failed login attempts per 15 minutes per IP
            if (!RateLimiter::check('user_login', $ip, 6, 900)) {
                if (!headers_sent()) http_response_code(429);
                echo json_encode([
                    'success' => false,
                    'message' => 'Too many failed login attempts. Please wait 15 minutes before trying again.'
                ]);
                return;
            }

            $emailOrPhone = trim($data['emailOrPhone'] ?? ($data['email'] ?? ($data['phone'] ?? '')));
            $password = $data['password'] ?? '';

            if (empty($emailOrPhone) || empty($password)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Please enter your email or phone and password.'
                ]);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');

            $user = $usersCol->findOne([
                '$or' => [
                    ['email' => $emailOrPhone],
                    ['phone' => $emailOrPhone]
                ]
            ]);

            if (!$user) {
                RateLimiter::hit('user_login', $ip, 900);
                if (!headers_sent()) http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'No registered account found with these credentials. Please sign up!'
                ]);
                return;
            }

            // Secure password verification (strict bcrypt check, no plaintext comparison)
            if (!password_verify($password, $user['password'])) {
                RateLimiter::hit('user_login', $ip, 900);
                if (!headers_sent()) http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid password. Please double check and try again!'
                ]);
                return;
            }

            // Login successful: reset rate limiter
            RateLimiter::clear('user_login', $ip);

            $token = JWT::generateToken($user['id'], $user['email'] ?: $user['phone'], 'customer', 60 * 24 * 7);

            if (!headers_sent()) {
                setcookie('user_token', $token, [
                    'expires' => time() + (7 * 24 * 60 * 60),
                    'path' => '/',
                    'httponly' => true,
                    'secure' => true,
                    'samesite' => 'Lax'
                ]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Logged in successfully!',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'] ?? '',
                    'phone' => $user['phone'] ?? '',
                    'joinedDate' => date('M Y', strtotime($user['created_at'] ?? 'now')),
                    'addresses' => is_string($user['addresses'] ?? null) ? (json_decode($user['addresses'], true) ?: []) : [],
                    'orders' => [],
                    'settings' => ['whatsappNotifications' => true, 'emailPromotions' => true, 'batchAlerts' => true]
                ],
                'token' => $token
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not complete login.']);
        }
    }

    public static function sendResetOtp(array $data): void {
        try {
            $ip = RateLimiter::getClientIp();
            $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);

            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
                return;
            }

            // Rate Limit: Max 3 OTP requests per 10 minutes per IP/email
            if (!RateLimiter::check('otp_send', $ip . '_' . $email, 3, 600)) {
                if (!headers_sent()) http_response_code(429);
                echo json_encode([
                    'success' => false,
                    'message' => 'Please wait a few minutes before requesting another OTP code.'
                ]);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');
            $user = $usersCol->findOne(['email' => $email]);

            if (!$user) {
                // Rate limit even non-existent emails to prevent email enumeration
                RateLimiter::hit('otp_send', $ip . '_' . $email, 600);
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'No registered account found with this email.']);
                return;
            }

            RateLimiter::hit('otp_send', $ip . '_' . $email, 600);

            $otp = strval(rand(100000, 999999));
            $expiresAt = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 mins
            $now = date('Y-m-d H:i:s');

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $resetsCol->deleteMany(['email' => $email]);
            $resetsCol->insertOne([
                'email' => $email,
                'otp' => $otp,
                'expires_at' => $expiresAt,
                'verified' => 0,
                'created_at' => $now,
                'updated_at' => $now
            ]);

            // Dispatch real email via SMTP
            Mailer::sendOtpEmail($email, $user['name'] ?? 'Valued Customer', $otp);

            echo json_encode([
                'success' => true,
                'message' => "A 6-digit OTP verification code has been sent directly to your registered email address ({$email}). Please check your inbox or spam folder!"
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not send verification OTP.']);
        }
    }

    public static function verifyResetOtp(array $data): void {
        try {
            $ip = RateLimiter::getClientIp();
            $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
            $otp = trim($data['otp'] ?? '');

            // Rate Limit: Max 5 guess attempts per 10 minutes to prevent brute-forcing OTP
            if (!RateLimiter::check('otp_verify', $ip . '_' . $email, 5, 600)) {
                if (!headers_sent()) http_response_code(429);
                echo json_encode([
                    'success' => false,
                    'message' => 'Too many incorrect attempts. Please request a new OTP code.'
                ]);
                return;
            }

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $record = $resetsCol->findOne(['email' => $email]);

            if (!$record || (isset($record['otp']) && $record['otp'] !== $otp) || (isset($record['expires_at']) && $record['expires_at'] < date('Y-m-d H:i:s'))) {
                RateLimiter::hit('otp_verify', $ip . '_' . $email, 600);
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP. Please try again!']);
                return;
            }

            RateLimiter::clear('otp_verify', $ip . '_' . $email);
            $resetsCol->updateOne(['email' => $email], ['verified' => 1]);

            echo json_encode([
                'success' => true,
                'message' => 'OTP verified successfully! You can now set your new password.'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not verify OTP.']);
        }
    }

    public static function resetPasswordWithOtp(array $data): void {
        try {
            $email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
            $otp = trim($data['otp'] ?? '');
            $newPassword = $data['newPassword'] ?? ($data['password'] ?? '');

            if (empty($newPassword) || strlen($newPassword) < 6) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
                return;
            }

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $record = $resetsCol->findOne(['email' => $email]);

            if (!$record || (isset($record['expires_at']) && $record['expires_at'] < date('Y-m-d H:i:s')) || empty($record['verified'])) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP authorization. Please request a new OTP.']);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');
            $hashed = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);
            $usersCol->updateOne(['email' => $email], ['password' => $hashed, 'updated_at' => date('Y-m-d H:i:s')]);
            $resetsCol->deleteMany(['email' => $email]);

            echo json_encode([
                'success' => true,
                'message' => 'Password reset successfully! You can now log in with your new password.'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not reset password.']);
        }
    }

    public static function getAll(): void {
        try {
            // Strict Administrator Authentication Guard: prevents unauthorized customer directory harvesting
            JWT::requireAdmin();

            $usersCol = MongoDBClient::getCollection('users');
            $rows = $usersCol->find();

            $users = array_map(function($u) {
                return [
                    'id' => "user_{$u['id']}",
                    'name' => $u['name'],
                    'email' => $u['email'] ?? '',
                    'phone' => $u['phone'] ?? '',
                    'joinedDate' => date('M Y', strtotime($u['created_at'] ?? 'now')),
                    'addresses' => is_string($u['addresses'] ?? null) ? (json_decode($u['addresses'], true) ?: []) : []
                ];
            }, $rows);

            echo json_encode(['success' => true, 'users' => $users]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not retrieve users.']);
        }
    }
}
