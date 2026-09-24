<?php
require_once __DIR__ . '/../config/mongodb.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/mailer.php';

class UserController {
    public static function register(array $data): void {
        try {
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $phone = trim($data['phone'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($name) || (empty($email) && empty($phone)) || empty($password)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Please provide full name, email or phone, and a password.'
                ]);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');

            // Single query check if email or phone exists
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

            $token = JWT::generateToken($id, $email ?: $phone, 'customer', 60 * 24 * 7); // 7 days

            if (!headers_sent()) {
                setcookie('user_token', $token, [
                    'expires' => time() + (7 * 24 * 60 * 60),
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
                http_response_code(201);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Account created and saved to MongoDB successfully!',
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
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function login(array $data): void {
        try {
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

            // Single fast $or query matching email or phone
            $user = $usersCol->findOne([
                '$or' => [
                    ['email' => $emailOrPhone],
                    ['phone' => $emailOrPhone]
                ]
            ]);

            if (!$user) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'No registered account found with these credentials. Please sign up!'
                ]);
                return;
            }

            if (!password_verify($password, $user['password']) && $password !== $user['password']) {
                if (!headers_sent()) http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid password. Please double check and try again!'
                ]);
                return;
            }

            $token = JWT::generateToken($user['id'], $user['email'] ?: $user['phone'], 'customer', 60 * 24 * 7);

            if (!headers_sent()) {
                setcookie('user_token', $token, [
                    'expires' => time() + (7 * 24 * 60 * 60),
                    'path' => '/',
                    'httponly' => true,
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
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function sendResetOtp(array $data): void {
        try {
            $email = trim($data['email'] ?? '');
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
                return;
            }

            $usersCol = MongoDBClient::getCollection('users');
            $user = $usersCol->findOne(['email' => $email]);

            if (!$user) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'No registered account found with this email.']);
                return;
            }

            $otp = strval(rand(100000, 999999));
            $expiresAt = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 mins
            $now = date('Y-m-d H:i:s');

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $resetsCol->deleteOne(['email' => $email]);
            $resetsCol->insertOne([
                'email' => $email,
                'otp' => $otp,
                'expires_at' => $expiresAt,
                'verified' => 0,
                'created_at' => $now,
                'updated_at' => $now
            ]);

            // Dispatch real email via SMTP
            $mailRes = Mailer::sendOtpEmail($email, $user['name'] ?? 'Valued Customer', $otp);

            echo json_encode([
                'success' => true,
                'message' => "A 6-digit OTP verification code has been sent directly to your registered email address ({$email}). Please check your inbox or spam folder!"
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function verifyResetOtp(array $data): void {
        try {
            $email = trim($data['email'] ?? '');
            $otp = trim($data['otp'] ?? '');

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $record = $resetsCol->findOne(['email' => $email]);

            if (!$record || (isset($record['otp']) && $record['otp'] !== $otp) || (isset($record['expires_at']) && $record['expires_at'] < date('Y-m-d H:i:s'))) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP. Please try again!']);
                return;
            }

            $resetsCol->updateOne(['email' => $email], ['verified' => 1]);

            echo json_encode([
                'success' => true,
                'message' => 'OTP verified successfully! You can now set your new password.'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function resetPasswordWithOtp(array $data): void {
        try {
            $email = trim($data['email'] ?? '');
            $otp = trim($data['otp'] ?? '');
            $newPassword = $data['newPassword'] ?? ($data['password'] ?? '');

            if (empty($newPassword) || strlen($newPassword) < 6) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
                return;
            }

            $resetsCol = MongoDBClient::getCollection('password_resets');
            $record = $resetsCol->findOne(['email' => $email]);

            if (!$record || (isset($record['expires_at']) && $record['expires_at'] < date('Y-m-d H:i:s'))) {
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
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getAll(): void {
        try {
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
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
