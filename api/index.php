<?php
/**
 * All Fresh Naturals - PHP REST API Router & Front Controller
 * Handles CORS, JSON Body Parsing, and Route Dispatching
 */

// Disable Public Error Display (Prevent server architecture leaks)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Security & Browser Hardening Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// 1. CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
$allowedOrigins = [
    'https://allfreshnaturals.com',
    'https://www.allfreshnaturals.com',
    'http://allfreshnaturals.com',
    'http://www.allfreshnaturals.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

$isAllowedOrigin = in_array($origin, $allowedOrigins) || strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false;

if ($isAllowedOrigin) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://allfreshnaturals.com");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
header("Access-Control-Expose-Headers: Authorization, Set-Cookie");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Set Default Response Header to JSON
header("Content-Type: application/json; charset=UTF-8");

// 3. Load Controllers & Security Modules
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/jwt.php';
require_once __DIR__ . '/config/rate_limiter.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/AdminController.php';

// 4. API Request Validation & Security Guards
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

if (!in_array($method, $allowedMethods)) {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'HTTP Method Not Allowed']);
    exit;
}

// 4.1 Anti-DDoS / API Flood Burst Limiter (Max 120 requests/min per IP)
$clientIp = RateLimiter::getClientIp();
if (!RateLimiter::check('api_burst', $clientIp, 120, 60)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many API requests. Please slow down.']);
    exit;
}
RateLimiter::hit('api_burst', $clientIp, 60);

// 4.2 Cross-Origin Request Forgery (CSRF) Guard on state-changing requests
if (in_array($method, ['POST', 'PUT', 'DELETE']) && !empty($origin) && !$isAllowedOrigin) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Cross-Origin Request Blocked by Security Policy']);
    exit;
}

// 4.3 Payload Size Guard (Max 5MB to prevent memory exhaustion)
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > (5 * 1024 * 1024)) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'Payload Too Large (Maximum 5MB allowed)']);
    exit;
}

// 4.4 Parse & Validate JSON Body
$rawBody = file_get_contents('php://input');
$body = [];
if (!empty($rawBody)) {
    $body = json_decode($rawBody, true, 32);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload format.']);
        exit;
    }
}

// 5. Parse Request Path & Route Dispatching
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^.*?/api/#i', '', $requestUri);
$path = trim($path, '/');

// 5. Route Handling

// Health Check
if ($path === 'health' || $path === '') {
    $db = Database::getConnection();
    $pCount = 0;
    try {
        $pCount = (int)$db->query("SELECT COUNT(*) FROM products")->fetchColumn();
    } catch (Exception $e) {}

    echo json_encode([
        'status' => 'ok',
        'message' => 'All Fresh Naturals PHP REST API active',
        'productionUrl' => 'https://allfreshnaturals.com',
        'server' => 'PHP ' . phpversion(),
        'database' => [
            'status' => 'connected',
            'driver' => Database::getDriverName(),
            'info' => Database::getDriverInfo(),
            'productsCount' => $pCount
        ],
        'dbTime' => date('c')
    ]);
    exit;
}

// --- PRODUCTS ROUTES ---
if ($path === 'products') {
    if ($method === 'GET') {
        ProductController::getAll();
    } elseif ($method === 'POST') {
        ProductController::create($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if (preg_match('#^products/([^/]+)/image$#', $path, $matches)) {
    ProductController::getImage($matches[1]);
    exit;
}

if (preg_match('#^products/([^/]+)$#', $path, $matches)) {
    $id = $matches[1];
    if ($method === 'GET') {
        ProductController::getById($id);
    } elseif ($method === 'PUT') {
        ProductController::update($id, $body);
    } elseif ($method === 'DELETE') {
        ProductController::delete($id);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

// --- ORDERS ROUTES ---
if ($path === 'orders/user') {
    OrderController::getUserOrders($_GET);
    exit;
}

if ($path === 'orders') {
    if ($method === 'GET') {
        OrderController::getAll();
    } elseif ($method === 'POST') {
        OrderController::create($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if (preg_match('#^orders/([^/]+)/status$#', $path, $matches)) {
    if ($method === 'PUT') {
        OrderController::updateStatus($matches[1], $body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if (preg_match('#^orders/([^/]+)$#', $path, $matches)) {
    if ($method === 'DELETE') {
        OrderController::delete($matches[1]);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

// --- USERS ROUTES ---
if ($path === 'users/register') {
    if ($method === 'POST') {
        UserController::register($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'users/login') {
    if ($method === 'POST') {
        UserController::login($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'users/send-reset-otp') {
    if ($method === 'POST') {
        UserController::sendResetOtp($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'users/verify-reset-otp') {
    if ($method === 'POST') {
        UserController::verifyResetOtp($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'users/reset-password-otp') {
    if ($method === 'POST') {
        UserController::resetPasswordWithOtp($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'users') {
    if ($method === 'GET') {
        UserController::getAll();
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

// --- ADMIN ROUTES ---
if ($path === 'admin/signin') {
    if ($method === 'POST') {
        AdminController::signin($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'admin/signup') {
    if ($method === 'POST') {
        AdminController::signup($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'admin/logout') {
    AdminController::logout();
    exit;
}

if ($path === 'admin/me') {
    AdminController::me();
    exit;
}

if ($path === 'admin/credentials') {
    if ($method === 'PUT') {
        AdminController::updateCredentials($body);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }
    exit;
}

if ($path === 'admin/clean-database') {
    AdminController::cleanDatabase();
    exit;
}

// Route Not Found Fallback
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => "API Endpoint not found: /api/{$path}",
    'method' => $method
]);

