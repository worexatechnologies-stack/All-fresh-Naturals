<?php
require_once __DIR__ . '/../config/mongodb.php';
require_once __DIR__ . '/../config/jwt.php';

class OrderController {
    public static function create(array $data): void {
        try {
            // XSS Protection & Input Sanitization
            $rawName = trim($data['customerName'] ?? ($data['name'] ?? ''));
            $rawPhone = trim($data['customerPhone'] ?? ($data['phone'] ?? ''));
            $rawEmail = trim($data['customerEmail'] ?? ($data['email'] ?? ''));
            $rawNotes = trim($data['notes'] ?? '');

            $customerName = htmlspecialchars(strip_tags($rawName), ENT_QUOTES, 'UTF-8');
            $customerPhone = preg_replace('/[^0-9+\-\s]/', '', $rawPhone);
            $customerEmail = filter_var($rawEmail, FILTER_SANITIZE_EMAIL);
            $notes = htmlspecialchars(strip_tags($rawNotes), ENT_QUOTES, 'UTF-8');

            $items = $data['items'] ?? [];
            $totalAmount = floatval($data['totalAmount'] ?? ($data['total'] ?? 0));

            if (empty($customerName) || empty($customerPhone)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Please provide customer name and a valid phone number.']);
                return;
            }

            if ($totalAmount < 0) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid order amount.']);
                return;
            }

            if (empty($items)) {
                if (!headers_sent()) http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Order must contain at least one item.']);
                return;
            }

            $orderId = !empty($data['orderId']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['orderId']) : ('AFN-' . strtoupper(substr(uniqid(), -6)));
            $id = $data['id'] ?? ('order_' . time() . '_' . rand(100, 999));
            $userId = trim($data['userId'] ?? ($data['user_id'] ?? ''));

            // Sanitize Shipping Address (prevent stored XSS)
            $rawShipping = $data['shippingAddress'] ?? ($data['address'] ?? '');
            if (is_array($rawShipping)) {
                $cleanShipping = [];
                foreach ($rawShipping as $k => $v) {
                    $cleanKey = htmlspecialchars(strip_tags((string)$k), ENT_QUOTES, 'UTF-8');
                    $cleanVal = is_string($v) ? htmlspecialchars(strip_tags($v), ENT_QUOTES, 'UTF-8') : $v;
                    $cleanShipping[$cleanKey] = $cleanVal;
                }
                $shippingAddress = json_encode($cleanShipping);
            } else {
                $shippingAddress = htmlspecialchars(strip_tags((string)$rawShipping), ENT_QUOTES, 'UTF-8');
            }

            $paymentMethod = preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['paymentMethod'] ?? 'COD');
            $paymentStatus = preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['paymentStatus'] ?? 'Pending');
            $status = preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['status'] ?? 'Confirmed');
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
                'message' => 'Order created successfully!'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not process order.']);
        }
    }

    public static function getUserOrders(array $query): void {
        try {
            $email = filter_var(trim($query['email'] ?? ''), FILTER_SANITIZE_EMAIL);
            $phone = preg_replace('/[^0-9+\-\s]/', '', trim($query['phone'] ?? ''));
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
            echo json_encode(['success' => false, 'message' => 'Could not retrieve user orders.']);
        }
    }

    public static function getAll(): void {
        try {
            // Strict Administrator Authentication Guard: prevents public customer data leak
            JWT::requireAdmin();

            $ordersCol = MongoDBClient::getCollection('orders');
            $rows = $ordersCol->find();

            $orders = array_map(function($r) {
                return self::formatOrder($r);
            }, $rows);

            echo json_encode(['success' => true, 'orders' => $orders]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Could not retrieve orders.']);
        }
    }

    public static function updateStatus(string $id, array $data): void {
        try {
            // Strict Administrator Authentication Guard
            JWT::requireAdmin();

            $status = preg_replace('/[^a-zA-Z0-9_\-\s]/', '', trim($data['status'] ?? ''));
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
                'message' => 'Order status updated successfully!'
            ]);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not update order status.']);
        }
    }

    public static function delete(string $id): void {
        try {
            // Strict Administrator Authentication Guard: unauthorized order deletion is blocked
            JWT::requireAdmin();

            $ordersCol = MongoDBClient::getCollection('orders');
            $ordersCol->deleteOne(['orderId' => $id]);
            $ordersCol->deleteOne(['id' => $id]);

            echo json_encode(['success' => true, 'message' => 'Order deleted successfully!']);
        } catch (Exception $e) {
            if (!headers_sent()) http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Could not delete order.']);
        }
    }

    private static function formatOrder(array $row): array {
        $shipping = $row['shippingAddress'] ?? '';
        $shippingObj = is_string($shipping) && strpos($shipping, '{') === 0 ? json_decode($shipping, true) : $shipping;

        $items = $row['items'] ?? '[]';
        $itemsArr = is_string($items) ? (json_decode($items, true) ?: []) : (is_array($items) ? $items : []);

        // Also generate human-readable items string for frontend display & metrics
        $itemsString = '';
        if (is_array($itemsArr) && !empty($itemsArr)) {
            $parts = [];
            foreach ($itemsArr as $it) {
                if (is_string($it)) {
                    $parts[] = trim($it, '"');
                } elseif (is_array($it)) {
                    $pName = $it['product']['name'] ?? ($it['name'] ?? 'Product');
                    $qty = $it['quantity'] ?? 1;
                    $parts[] = "{$pName} x{$qty}";
                }
            }
            $itemsString = implode(', ', $parts);
        }
        if (empty($itemsString)) {
            $itemsString = is_string($items) ? trim($items, '"') : '1 item';
        }

        $totalVal = (float)($row['totalAmount'] ?? ($row['total'] ?? 0));

        return [
            'id' => $row['id'] ?? ($row['orderId'] ?? ''),
            'orderId' => $row['orderId'] ?? ($row['id'] ?? ''),
            'userId' => $row['userId'] ?? '',
            'customerName' => $row['customerName'] ?? ($row['name'] ?? 'Customer'),
            'customerEmail' => $row['customerEmail'] ?? ($row['email'] ?? ''),
            'customerPhone' => $row['customerPhone'] ?? ($row['phone'] ?? ''),
            'shippingAddress' => $shippingObj,
            'items' => $itemsString,
            'itemsDetail' => $itemsArr,
            'total' => $totalVal,
            'totalAmount' => $totalVal,
            'paymentMethod' => $row['paymentMethod'] ?? 'COD',
            'paymentStatus' => $row['paymentStatus'] ?? 'Pending',
            'status' => $row['status'] ?? 'Confirmed',
            'notes' => $row['notes'] ?? '',
            'date' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s')
        ];
    }
}
