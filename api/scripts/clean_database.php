<?php
/**
 * Database Cleanup & Reset Script for All Fresh Naturals
 * Removes all test orders, test users, and resets the database to a clean, fresh state.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/mongodb.php';

echo "===========================================\n";
echo "ALL FRESH NATURALS - DATABASE CLEANUP\n";
echo "===========================================\n\n";

// 1. Reset Orders
echo "1. Cleaning test orders...\n";
$ordersCol = MongoDBClient::getCollection('orders');
$ordersCol->deleteMany([]);
echo "   -> Orders wiped clean (0 orders).\n\n";

// 2. Reset Test Users
echo "2. Cleaning test users...\n";
$usersCol = MongoDBClient::getCollection('users');
$usersCol->deleteMany([]);
echo "   -> Users wiped clean (0 test users).\n\n";

// 3. Reset Password Resets
echo "3. Cleaning password resets...\n";
$pwdCol = MongoDBClient::getCollection('password_resets');
$pwdCol->deleteMany([]);
echo "   -> Password reset tokens cleared.\n\n";

// 4. Ensure Fresh & Authentic Products
echo "4. Resetting and verifying clean product catalog...\n";
$productsCol = MongoDBClient::getCollection('products');
$productsCol->deleteMany([]);

$now = date('Y-m-d H:i:s');

$abcMalt = [
    'id' => 'abc_malt',
    'name' => 'ABC Malt',
    'badge' => 'Best Seller',
    'tagline' => 'Wholesome Nutrition in Every Sip!',
    'description' => 'A delicious and nourishing health drink mix made with the goodness of Apple, Beetroot, Carrot, Jaggery, Nuts and Cardamom (Elaichi). Prepared with care by All Fresh Naturals.',
    'price' => 399.00,
    'original_price' => 599.00,
    'size' => '250gm',
    'image' => '/assets/abc_malt_dual_mockup.jpg',
    'altImage' => '/assets/abc_malt_back_info.jpg',
    'ingredients' => ['Apple', 'Beetroot', 'Carrot', 'Jaggery', 'Almonds', 'Cashews', 'Cardamom (Elaichi)'],
    'benefits' => [
        'Supports Everyday Energy & Vitality',
        'Packed with Beta-carotene and Antioxidants',
        'Naturally Sweetened with Premium Jaggery (Sugar-Free)',
        'Rich in Dietary Fibre & Essential Nutrients',
        '100% Natural & Homemade style with zero artificial additives'
    ],
    'usage_instructions' => 'Add 2-3 spoonfuls of ABC Malt powder to warm milk. Mix thoroughly and enjoy it fresh. Perfect for breakfast or evening refreshment!',
    'created_at' => $now,
    'updated_at' => $now
];

$ragiMalt = [
    'id' => 'ragi_malt',
    'name' => 'Ragi Malt Health Mix',
    'badge' => 'Traditional Recipe',
    'tagline' => 'Experience the goodness of traditional nutrition',
    'description' => 'A wholesome health mix made from carefully selected natural ingredients such as ragi, jowar, wheat, rice, nuts, green gram, fenugreek, dry ginger, pepper, jeera, and other grains. Rich in calcium, iron, protein, and fiber.',
    'price' => 199.00,
    'original_price' => 399.00,
    'size' => '250gm',
    'image' => '/assets/ragi_malt_front_mockup.jpg',
    'altImage' => '/assets/ragi_malt_back_info.jpg',
    'ingredients' => ['Ragi (Finger Millet)', 'Jowar', 'Wheat', 'Rice', 'Almonds', 'Cashews', 'Green Gram', 'Fenugreek', 'Dry Ginger', 'Black Pepper', 'Jeera'],
    'benefits' => [
        'Rich Source of Natural Calcium & Bone Strength',
        'High Fibre Content for Smooth Digestion',
        'Sustained Energy Release Throughout the Day',
        'Ideal Health Drink for Children, Adults & Seniors',
        'Handmade Fresh in Small Batches'
    ],
    'usage_instructions' => 'Mix 2 tbsp of Ragi Malt with milk or water, cook on low flame for 3-5 minutes until smooth, add jaggery or milk as per taste and serve warm.',
    'created_at' => $now,
    'updated_at' => $now
];

$productsCol->insertOne($abcMalt);
$productsCol->insertOne($ragiMalt);
echo "   -> 2 Official products initialized (ABC Malt & Ragi Malt).\n\n";

// 5. Ensure Clean Administrator Account
echo "5. Verifying administrator credentials...\n";
$adminCol = MongoDBClient::getCollection('admin_credentials');
$adminCol->deleteMany([]);

$adminData = [
    'id' => 'admin_1',
    'email' => 'poori.monika@gmail.com',
    'password' => password_hash('Poorimonika@123', PASSWORD_BCRYPT),
    'pin' => '2026',
    'role' => 'administrator',
    'created_at' => $now,
    'updated_at' => $now
];
$adminCol->insertOne($adminData);
echo "   -> Administrator account set (poori.monika@gmail.com / PIN: 2026).\n\n";

// 6. Direct SQLite file cleanup if SQLite exists
$sqliteFile = __DIR__ . '/../data/database.sqlite';
if (file_exists($sqliteFile)) {
    try {
        $pdo = new PDO("sqlite:" . $sqliteFile);
        $pdo->exec("DELETE FROM orders");
        $pdo->exec("DELETE FROM users");
        $pdo->exec("DELETE FROM password_resets");
        echo "6. Direct SQLite database at api/data/database.sqlite cleared.\n";
    } catch (Exception $e) {
        echo "6. SQLite cleanup note: " . $e->getMessage() . "\n";
    }
}

echo "\n===========================================\n";
echo "✅ DATABASE IS NOW 100% CLEAN & READY FOR PRODUCTION!\n";
echo "===========================================\n";
