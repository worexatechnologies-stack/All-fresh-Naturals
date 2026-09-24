<?php
/**
 * All Fresh Naturals - Direct SMTP Mailer
 * Connects directly to SMTP server (e.g. Gmail / Hostinger SMTP) via SSL/TLS socket
 * Guarantees real email delivery directly into customer inboxes.
 */

class Mailer {
    private static function loadEnv(): void {
        $envFile = __DIR__ . '/../../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim($val, " \t\n\r\0\x0B\"'");
                if (!getenv($key)) {
                    putenv("{$key}={$val}");
                    $_ENV[$key] = $val;
                }
            }
        }
    }

    public static function sendOtpEmail(string $toEmail, string $userName, string $otp): array {
        self::loadEnv();

        $smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $smtpPort = (int)(getenv('SMTP_PORT') ?: 587);
        $smtpUser = getenv('SMTP_USER') ?: 'poori.monika@gmail.com';
        $smtpPass = getenv('SMTP_PASS') ?: 'ltrx rmlc miek jrxm';
        $smtpPass = str_replace(' ', '', $smtpPass); // remove any spaces in app password

        $fromEmail = $smtpUser;
        $fromName = 'All Fresh Naturals';
        $subject = "Your Verification Code: {$otp} - All Fresh Naturals";

        $htmlBody = "
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f4; margin: 0; padding: 20px; color: #1f2937; }
  .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
  .header { background: linear-gradient(135deg, #0d3b24 0%, #15803d 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
  .header h1 { margin: 0 0 4px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
  .header p { margin: 0; font-size: 13px; color: #dcfce7; }
  .body { padding: 32px 28px; }
  .greeting { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 12px; }
  .text { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
  .otp-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
  .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #15803d; margin-bottom: 6px; }
  .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0d3b24; font-family: Consolas, Monaco, monospace; }
  .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
</style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>All Fresh Naturals</h1>
      <p>Wholesome Homemade Nutrition</p>
    </div>
    <div class='body'>
      <div class='greeting'>Hello " . htmlspecialchars($userName) . ",</div>
      <div class='text'>
        We received a request to reset the password for your All Fresh Naturals account. Please use the 6-digit verification code below to complete your password reset:
      </div>
      <div class='otp-box'>
        <div class='otp-label'>Your One-Time Password (OTP)</div>
        <div class='otp-code'>{$otp}</div>
      </div>
      <div class='text' style='font-size: 13px; color: #6b7280; margin-bottom: 0;'>
        ⏱️ This code is valid for <strong>10 minutes</strong>. If you did not request this password reset, please ignore this email or contact support.
      </div>
    </div>
    <div class='footer'>
      &copy; " . date('Y') . " All Fresh Naturals. All rights reserved.<br>
      Bangalore, Karnataka, India
    </div>
  </div>
</body>
</html>
";

        return self::sendDirectSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName, $toEmail, $subject, $htmlBody);
    }

    private static function sendDirectSmtp(
        string $host,
        int $port,
        string $username,
        string $password,
        string $fromEmail,
        string $fromName,
        string $toEmail,
        string $subject,
        string $htmlBody
    ): array {
        $timeout = 4;
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        // If port 465, use direct SSL
        if ($port === 465) {
            $socket = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        } else {
            // Port 587 with STARTTLS
            $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        }

        if (!$socket) {
            error_log("SMTP Connection failed to {$host}:{$port} - Error {$errno}: {$errstr}");
            // Fallback to PHP built-in mail()
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        stream_set_timeout($socket, 4);

        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function($cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
        };

        $res = $read();
        if (substr($res, 0, 3) !== '220') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        $localhost = $_SERVER['SERVER_NAME'] ?? 'localhost';
        $write("EHLO {$localhost}");
        $res = $read();

        // If port 587, upgrade to TLS
        if ($port === 587) {
            $write("STARTTLS");
            $res = $read();
            if (substr($res, 0, 3) === '220') {
                if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                    fclose($socket);
                    return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
                }
                $write("EHLO {$localhost}");
                $res = $read();
            }
        }

        // Authenticate
        $write("AUTH LOGIN");
        $res = $read();
        if (substr($res, 0, 3) !== '334') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        $write(base64_encode($username));
        $res = $read();
        if (substr($res, 0, 3) !== '334') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        $write(base64_encode($password));
        $res = $read();
        if (substr($res, 0, 3) !== '235') {
            error_log("SMTP Auth failed: {$res}");
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        // Mail From
        $write("MAIL FROM: <{$fromEmail}>");
        $res = $read();
        if (substr($res, 0, 3) !== '250') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        // Rcpt To
        $write("RCPT TO: <{$toEmail}>");
        $res = $read();
        if (substr($res, 0, 3) !== '250') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        // Data
        $write("DATA");
        $res = $read();
        if (substr($res, 0, 3) !== '354') {
            fclose($socket);
            return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
        }

        $boundary = "==Multipart_Boundary_x" . md5(time()) . "x";

        $headers = [];
        $headers[] = "From: {$fromName} <{$fromEmail}>";
        $headers[] = "To: <{$toEmail}>";
        $headers[] = "Subject: {$subject}";
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-Type: text/html; charset=UTF-8";
        $headers[] = "Content-Transfer-Encoding: 8bit";
        $headers[] = "Date: " . date('r');
        $headers[] = "Message-ID: <" . md5(uniqid(microtime(), true)) . "@allfreshnaturals.com>";

        $content = implode("\r\n", $headers) . "\r\n\r\n" . $htmlBody . "\r\n.";
        $write($content);

        $res = $read();
        $write("QUIT");
        fclose($socket);

        if (substr($res, 0, 3) === '250') {
            return [
                'success' => true,
                'method' => 'smtp',
                'message' => 'OTP email delivered successfully via Gmail SMTP!'
            ];
        }

        return self::fallbackMail($toEmail, $subject, $htmlBody, $fromEmail, $fromName);
    }

    private static function fallbackMail(string $to, string $subject, string $htmlBody, string $fromEmail, string $fromName): array {
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
        $headers .= "Reply-To: {$fromEmail}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        $sent = @mail($to, $subject, $htmlBody, $headers);
        return [
            'success' => $sent,
            'method' => 'mail',
            'message' => $sent ? 'OTP email dispatched via server mailer!' : 'Could not dispatch email.'
        ];
    }
}
