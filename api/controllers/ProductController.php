<?php
require_once __DIR__ . '/../config/mongodb.php';
require_once __DIR__ . '/../config/jwt.php';

class ProductController {
    public static function getAll(): void {
        try {
            $productsCol = MongoDBClient::getCollection('products');
            $rows = $productsCol->find();

            $products = array_map(function($row) {
                return self::formatProduct($row);
            }, $rows);

            echo json_encode(['success' => true, 'products' => $products]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not retrieve products.']);
        }
    }

    public static function getById(string $id): void {
        try {
            $cleanId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
            $productsCol = MongoDBClient::getCollection('products');
            $row = $productsCol->findOne(['id' => $cleanId]);

            if (!$row) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.']);
                return;
            }

            echo json_encode(['success' => true, 'product' => self::formatProduct($row)]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not retrieve product.']);
        }
    }

    public static function getImage(string $id): void {
        try {
            $cleanId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
            $productsCol = MongoDBClient::getCollection('products');
            $row = $productsCol->findOne(['id' => $cleanId]);

            if (!$row || empty($row['image'])) {
                if (!headers_sent()) http_response_code(404);
                echo 'Image not found in database.';
                return;
            }

            $img = $row['image'];
            if (strpos($img, 'data:') === 0) {
                $parts = explode(';', $img);
                $mime = str_replace('data:', '', $parts[0]);
                $base64Data = str_replace('base64,', '', $parts[1] ?? '');
                header("Content-Type: " . ($mime ?: 'image/jpeg'));
                header("Cache-Control: public, max-age=86400");
                echo base64_decode($base64Data);
                return;
            }

            // Open Redirect Protection: Only allow same-origin relative paths or HTTPS domain
            if (strpos($img, '/') === 0 || strpos($img, 'https://allfreshnaturals.com') === 0) {
                header("Location: " . $img);
            } else {
                if (!headers_sent()) http_response_code(400);
                echo 'Invalid image location.';
            }
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo 'Error fetching image.';
        }
    }

    public static function create(array $data): void {
        try {
            // Strict Administrator Authentication Guard: prevents unauthorized product creation
            JWT::requireAdmin();

            $rawName = trim($data['name'] ?? '');
            $name = htmlspecialchars(strip_tags($rawName), ENT_QUOTES, 'UTF-8');
            $price = floatval($data['price'] ?? 0);

            if (empty($name) || $price <= 0) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide product name and valid price.']);
                return;
            }

            $id = !empty($data['id']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['id']) : ('prod_' . time() . '_' . rand(100, 999));
            $badge = htmlspecialchars(strip_tags($data['badge'] ?? 'Natural Choice'), ENT_QUOTES, 'UTF-8');
            $tagline = htmlspecialchars(strip_tags($data['tagline'] ?? ''), ENT_QUOTES, 'UTF-8');
            $description = htmlspecialchars(strip_tags($data['description'] ?? ''), ENT_QUOTES, 'UTF-8');
            $originalPrice = isset($data['original_price']) ? floatval($data['original_price']) : (isset($data['originalPrice']) ? floatval($data['originalPrice']) : null);
            $size = htmlspecialchars(strip_tags($data['size'] ?? '250gm'), ENT_QUOTES, 'UTF-8');
            $image = filter_var($data['image'] ?? '', FILTER_SANITIZE_URL);
            $altImage = filter_var($data['altImage'] ?? '', FILTER_SANITIZE_URL);
            $ingredients = is_array($data['ingredients'] ?? null) ? json_encode($data['ingredients']) : json_encode([]);
            $benefits = is_array($data['benefits'] ?? null) ? json_encode($data['benefits']) : json_encode([]);
            $usage = htmlspecialchars(strip_tags($data['usage'] ?? ($data['usage_instructions'] ?? '')), ENT_QUOTES, 'UTF-8');
            $now = date('Y-m-d H:i:s');

            $doc = [
                'id' => $id, 'name' => $name, 'badge' => $badge, 'tagline' => $tagline,
                'description' => $description, 'price' => $price, 'original_price' => $originalPrice, 'size' => $size,
                'image' => $image, 'altImage' => $altImage, 'ingredients' => $ingredients,
                'benefits' => $benefits, 'usage_instructions' => $usage, 'created_at' => $now, 'updated_at' => $now
            ];

            $productsCol = MongoDBClient::getCollection('products');
            $productsCol->insertOne($doc);

            if (!headers_sent()) http_response_code(201);
            echo json_encode(['success' => true, 'product' => self::formatProduct($doc), 'message' => 'Product saved successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not create product.']);
        }
    }

    public static function update(string $id, array $data): void {
        try {
            // Strict Administrator Authentication Guard: prevents unauthorized pricing or product modification
            JWT::requireAdmin();

            $cleanId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
            $productsCol = MongoDBClient::getCollection('products');
            $current = $productsCol->findOne(['id' => $cleanId]);

            if (!$current) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.']);
                return;
            }

            $updateData = [];
            if (isset($data['name'])) $updateData['name'] = htmlspecialchars(strip_tags(trim($data['name'])), ENT_QUOTES, 'UTF-8');
            if (isset($data['badge'])) $updateData['badge'] = htmlspecialchars(strip_tags(trim($data['badge'])), ENT_QUOTES, 'UTF-8');
            if (isset($data['tagline'])) $updateData['tagline'] = htmlspecialchars(strip_tags(trim($data['tagline'])), ENT_QUOTES, 'UTF-8');
            if (isset($data['description'])) $updateData['description'] = htmlspecialchars(strip_tags(trim($data['description'])), ENT_QUOTES, 'UTF-8');
            if (isset($data['price'])) $updateData['price'] = floatval($data['price']);
            if (isset($data['original_price'])) $updateData['original_price'] = floatval($data['original_price']);
            if (isset($data['originalPrice'])) $updateData['original_price'] = floatval($data['originalPrice']);
            if (isset($data['size'])) $updateData['size'] = htmlspecialchars(strip_tags(trim($data['size'])), ENT_QUOTES, 'UTF-8');
            if (isset($data['image'])) $updateData['image'] = filter_var($data['image'], FILTER_SANITIZE_URL);
            if (isset($data['altImage'])) $updateData['altImage'] = filter_var($data['altImage'], FILTER_SANITIZE_URL);
            if (isset($data['ingredients'])) $updateData['ingredients'] = is_array($data['ingredients']) ? json_encode($data['ingredients']) : $data['ingredients'];
            if (isset($data['benefits'])) $updateData['benefits'] = is_array($data['benefits']) ? json_encode($data['benefits']) : $data['benefits'];
            if (isset($data['usage']) || isset($data['usage_instructions'])) {
                $updateData['usage_instructions'] = htmlspecialchars(strip_tags($data['usage'] ?? $data['usage_instructions']), ENT_QUOTES, 'UTF-8');
            }

            $productsCol->updateOne(['id' => $cleanId], $updateData);
            $updated = $productsCol->findOne(['id' => $cleanId]);

            echo json_encode(['success' => true, 'product' => self::formatProduct($updated), 'message' => 'Product updated successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not update product.']);
        }
    }

    public static function delete(string $id): void {
        try {
            // Strict Administrator Authentication Guard: prevents unauthorized product deletion
            JWT::requireAdmin();

            $cleanId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
            $productsCol = MongoDBClient::getCollection('products');
            $productsCol->deleteOne(['id' => $cleanId]);

            echo json_encode(['success' => true, 'message' => 'Product deleted successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not delete product.']);
        }
    }

    private static function formatProduct(array $row): array {
        return [
            'id' => $row['id'] ?? '',
            'name' => $row['name'] ?? '',
            'badge' => $row['badge'] ?? '',
            'tagline' => $row['tagline'] ?? '',
            'description' => $row['description'] ?? '',
            'price' => (float)($row['price'] ?? 0),
            'originalPrice' => isset($row['original_price']) ? (float)$row['original_price'] : (isset($row['originalPrice']) ? (float)$row['originalPrice'] : null),
            'size' => $row['size'] ?? '250gm',
            'image' => $row['image'] ?? '',
            'altImage' => $row['altImage'] ?? '',
            'ingredients' => is_string($row['ingredients'] ?? null) ? (json_decode($row['ingredients'], true) ?: []) : (is_array($row['ingredients'] ?? null) ? $row['ingredients'] : []),
            'benefits' => is_string($row['benefits'] ?? null) ? (json_decode($row['benefits'], true) ?: []) : (is_array($row['benefits'] ?? null) ? $row['benefits'] : []),
            'usage' => $row['usage_instructions'] ?? ($row['usage'] ?? '')
        ];
    }
}
