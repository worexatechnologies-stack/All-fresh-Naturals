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
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getById(string $id): void {
        try {
            $productsCol = MongoDBClient::getCollection('products');
            $row = $productsCol->findOne(['id' => $id]);

            if (!$row) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.']);
                return;
            }

            echo json_encode(['success' => true, 'product' => self::formatProduct($row)]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getImage(string $id): void {
        try {
            $productsCol = MongoDBClient::getCollection('products');
            $row = $productsCol->findOne(['id' => $id]);

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

            header("Location: " . $img);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo $e->getMessage();
        }
    }

    public static function create(array $data): void {
        try {
            $name = trim($data['name'] ?? '');
            $price = floatval($data['price'] ?? 0);

            if (empty($name) || $price <= 0) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide product name and valid price.']);
                return;
            }

            $id = !empty($data['id']) ? $data['id'] : ('prod_' . time() . '_' . rand(100, 999));
            $badge = $data['badge'] ?? 'Natural Choice';
            $tagline = $data['tagline'] ?? '';
            $description = $data['description'] ?? '';
            $originalPrice = isset($data['original_price']) ? floatval($data['original_price']) : (isset($data['originalPrice']) ? floatval($data['originalPrice']) : null);
            $size = $data['size'] ?? '250gm';
            $image = $data['image'] ?? '';
            $altImage = $data['altImage'] ?? '';
            $ingredients = is_array($data['ingredients'] ?? null) ? json_encode($data['ingredients']) : json_encode([]);
            $benefits = is_array($data['benefits'] ?? null) ? json_encode($data['benefits']) : json_encode([]);
            $usage = $data['usage'] ?? ($data['usage_instructions'] ?? '');
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
            echo json_encode(['success' => true, 'product' => self::formatProduct($doc), 'message' => 'Product saved to MongoDB successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function update(string $id, array $data): void {
        try {
            $productsCol = MongoDBClient::getCollection('products');
            $current = $productsCol->findOne(['id' => $id]);

            if (!$current) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Product not found.']);
                return;
            }

            $updateData = [];
            if (isset($data['name'])) $updateData['name'] = $data['name'];
            if (isset($data['badge'])) $updateData['badge'] = $data['badge'];
            if (isset($data['tagline'])) $updateData['tagline'] = $data['tagline'];
            if (isset($data['description'])) $updateData['description'] = $data['description'];
            if (isset($data['price'])) $updateData['price'] = floatval($data['price']);
            if (isset($data['original_price'])) $updateData['original_price'] = floatval($data['original_price']);
            if (isset($data['originalPrice'])) $updateData['original_price'] = floatval($data['originalPrice']);
            if (isset($data['size'])) $updateData['size'] = $data['size'];
            if (isset($data['image'])) $updateData['image'] = $data['image'];
            if (isset($data['altImage'])) $updateData['altImage'] = $data['altImage'];
            if (isset($data['ingredients'])) $updateData['ingredients'] = is_array($data['ingredients']) ? json_encode($data['ingredients']) : $data['ingredients'];
            if (isset($data['benefits'])) $updateData['benefits'] = is_array($data['benefits']) ? json_encode($data['benefits']) : $data['benefits'];
            if (isset($data['usage']) || isset($data['usage_instructions'])) $updateData['usage_instructions'] = $data['usage'] ?? $data['usage_instructions'];

            $productsCol->updateOne(['id' => $id], $updateData);
            $updated = $productsCol->findOne(['id' => $id]);

            echo json_encode(['success' => true, 'product' => self::formatProduct($updated), 'message' => 'Product updated in MongoDB successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function delete(string $id): void {
        try {
            $productsCol = MongoDBClient::getCollection('products');
            $productsCol->deleteOne(['id' => $id]);

            echo json_encode(['success' => true, 'message' => 'Product deleted from MongoDB successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
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
