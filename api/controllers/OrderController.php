<?php
require_once __DIR__ . '/../config/mongodb.php';
require_once __DIR__ . '/../config/jwt.php';

class OrderController {
    public static function create(array $data): void {
        try {
            $customerName = trim($data['customerName'] ?? ($data['name'] ?? ''));
            $customerPhone = trim($data['customerPhone'] ?? ($data['phone'] ?? ''));
            $items = $data['items'] ?? [];
            $totalAmount = floatval($data['totalAmount'] ?? ($data['total'] ?? 0));

            if (empty($customerName) || empty($customerPhone)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide customer name and phone number.']);
                return;
            }

            if (empty($items)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Order must contain at least one item.']);
                return;
            }

            $orderId = !empty($data['orderId']) ? $data['orderId'] : ('AFN-' . strtoupper(substr(uniqid(), -6)));
            $id = $data['id'] ?? ('order_' . time() . '_' . rand(100, 999));
            $userId = $data['userId'] ?? ($data['user_id'] ?? '');
            $customerEmail = $data['customerEmail'] ?? ($data['email'] ?? '');
            
            $shippingAddress = $data['shippingAddress'] ?? ($data['address'] ?? '');
            if (is_array($shippingAddress)) {
                $shippingAddress = json_encode($shippingAddress);
            }

            $paymentMethod = $data['paymentMethod'] ?? 'COD';
            $paymentStatus = $data['paymentStatus'] ?? 'Pending';
            $status = $data['status'] ?? 'Confirmed';
            $notes = $data['notes'] ?? '';
            $itemsJson = json_encode($items);
            $now = date('Y-m-d H:i:s');

            $orderDoc = [
                'id' => $id,
                'orderId' => $orderId,
                'userId' => $userId,
                'customerName' => $customerName,
                'customerEmail' => $customerEmail,
                'customerPhone' => $customerPhone,
                'shippingAddress' => $shippingAddress,
                'items' => $itemsJson,
                'totalAmount' => $totalAmount,
                'paymentMethod' => $paymentMethod,
                'paymentStatus' => $paymentStatus,
                'status' => $status,
                'notes' => $notes,
                'created_at' => $now,
                'updated_at' => $now
            ];

            $ordersCol = MongoDBClient::getCollection('orders');
            $ordersCol->insertOne($orderDoc);

            $order = self::formatOrder($orderDoc);

            if (!headers_sent()) http_response_code(201);
            echo json_encode([
                'success' => true,
                'order' => $order,
                'message' => 'Order saved directly into MongoDB successfully!'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getUserOrders(array $query): void {
        try {
            $email = trim($query['email'] ?? '');
            $phone = trim($query['phone'] ?? '');
            $userId = trim($query['userId'] ?? ($query['user_id'] ?? ''));

            if (empty($email) && empty($phone) && empty($userId)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide userId, email, or phone.']);
                return;
            }

            $filter = [];
            if (!empty($userId)) {
                $filter['userId'] = $userId;
            } elseif (!empty($email)) {
                $filter['customerEmail'] = $email;
            } elseif (!empty($phone)) {
                $filter['customerPhone'] = $phone;
            }

            $ordersCol = MongoDBClient::getCollection('orders');
            $rows = $ordersCol->find($filter);

            $orders = array_map(function($r) {
                return self::formatOrder($r);
            }, $rows);

            echo json_encode(['success' => true, 'orders' => $orders]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function getAll(): void {
        try {
            $ordersCol = MongoDBClient::getCollection('orders');
            $rows = $ordersCol->find();

            $orders = array_map(function($r) {
                return self::formatOrder($r);
            }, $rows);

            echo json_encode(['success' => true, 'orders' => $orders]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function updateStatus(string $id, array $data): void {
        try {
            $status = trim($data['status'] ?? '');
            if (empty($status)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide a valid order status.']);
                return;
            }

            $ordersCol = MongoDBClient::getCollection('orders');
            $ordersCol->updateOne(['orderId' => $id], ['status' => $status]);
            $ordersCol->updateOne(['id' => $id], ['status' => $status]);

            $updated = $ordersCol->findOne(['orderId' => $id]) ?: $ordersCol->findOne(['id' => $id]);

            if (!$updated) {
                if (!headers_sent()) http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Order not found.']);
                return;
            }

            echo json_encode([
                'success' => true,
                'order' => self::formatOrder($updated),
                'message' => 'Order status updated in MongoDB successfully!'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public static function delete(string $id): void {
        try {
            $ordersCol = MongoDBClient::getCollection('orders');
            $ordersCol->deleteOne(['orderId' => $id]);
            $ordersCol->deleteOne(['id' => $id]);

            echo json_encode(['success' => true, 'message' => 'Order deleted from MongoDB successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    private static function formatOrder(array $row): array {
        $shipping = $row['shippingAddress'] ?? '';
        $shippingObj = is_string($shipping) && strpos($shipping, '{') === 0 ? json_decode($shipping, true) : $shipping;

        $items = $row['items'] ?? '[]';
        $itemsArr = is_string($items) ? (json_decode($items, true) ?: []) : (is_array($items) ? $items : []);

        return [
            'id' => $row['id'] ?? '',
            'orderId' => $row['orderId'] ?? ($row['id'] ?? ''),
            'userId' => $row['userId'] ?? '',
            'customerName' => $row['customerName'] ?? '',
            'customerEmail' => $row['customerEmail'] ?? '',
            'customerPhone' => $row['customerPhone'] ?? '',
            'shippingAddress' => $shippingObj,
            'items' => $itemsArr,
            'totalAmount' => (float)($row['totalAmount'] ?? 0),
            'paymentMethod' => $row['paymentMethod'] ?? 'COD',
            'paymentStatus' => $row['paymentStatus'] ?? 'Pending',
            'status' => $row['status'] ?? 'Confirmed',
            'notes' => $row['notes'] ?? '',
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
    }
}
