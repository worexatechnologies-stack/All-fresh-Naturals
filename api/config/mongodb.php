<?php
/**
 * MongoDB Atlas Cloud Client for PHP
 * Connects directly to MongoDB Atlas cluster using MongoDB\Driver\Manager
 * Includes resilient fallbacks and auto-seeding for products and administrator credentials.
 */

require_once __DIR__ . '/db.php';

class MongoDBCollection {
    private string $collectionName;
    private string $dbName;
    private ?MongoDB\Driver\Manager $manager = null;
    private bool $hasExtension = false;

    public function __construct(string $collectionName) {
        $this->collectionName = $collectionName;
        $this->dbName = getenv('MONGODB_DB') ?: 'fresh_naturals_db';
        $this->hasExtension = class_exists('MongoDB\Driver\Manager');

        if ($this->hasExtension) {
            $uri = getenv('MONGODB_URI') ?: 'mongodb://sachinworexa_db_user:lq6CbUx8UOxqasmt@ac-qt0l01o-shard-00-00.lxdljg7.mongodb.net:27017,ac-qt0l01o-shard-00-01.lxdljg7.mongodb.net:27017,ac-qt0l01o-shard-00-02.lxdljg7.mongodb.net:27017/fresh_naturals_db?authSource=admin&replicaSet=atlas-2vs44h-shard-0&tls=true&retryWrites=true&w=majority';
            try {
                $this->manager = new MongoDB\Driver\Manager($uri, [
                    'tls' => true,
                    'retryWrites' => true,
                    'w' => 'majority',
                    'serverSelectionTimeoutMS' => 5000
                ]);
            } catch (Exception $e) {
                error_log("MongoDB Atlas Manager init failed: " . $e->getMessage());
                $this->manager = null;
            }
        }
    }

    public function isConnectedToAtlas(): bool {
        return $this->hasExtension && ($this->manager !== null);
    }

    public function find(array $filter = [], array $options = []): array {
        if ($this->isConnectedToAtlas()) {
            try {
                $query = new MongoDB\Driver\Query($filter, $options);
                $cursor = $this->manager->executeQuery("{$this->dbName}.{$this->collectionName}", $query);
                $results = [];
                foreach ($cursor as $doc) {
                    $arr = json_decode(json_encode($doc), true);
                    if (isset($arr['_id']) && is_array($arr['_id']) && isset($arr['_id']['$oid'])) {
                        $arr['_id'] = $arr['_id']['$oid'];
                    }
                    $results[] = $arr;
                }
                if (!empty($results)) {
                    return $results;
                }
            } catch (Exception $e) {
                error_log("MongoDB Atlas Query error: " . $e->getMessage());
            }
        }

        // Fallback to local DB layer
        return $this->fallbackFind($filter);
    }

    public function findOne(array $filter = []): ?array {
        if ($this->isConnectedToAtlas()) {
            try {
                $query = new MongoDB\Driver\Query($filter, ['limit' => 1]);
                $cursor = $this->manager->executeQuery("{$this->dbName}.{$this->collectionName}", $query);
                $results = [];
                foreach ($cursor as $doc) {
                    $arr = json_decode(json_encode($doc), true);
                    if (isset($arr['_id']) && is_array($arr['_id']) && isset($arr['_id']['$oid'])) {
                        $arr['_id'] = $arr['_id']['$oid'];
                    }
                    $results[] = $arr;
                }
                if (!empty($results)) {
                    return $results[0];
                }
            } catch (Exception $e) {
                error_log("MongoDB Atlas findOne error: " . $e->getMessage());
            }
        }

        $fallback = $this->fallbackFind($filter);
        return !empty($fallback) ? $fallback[0] : null;
    }

    public function insertOne(array $document, bool $allowFallback = true): bool {
        if (!isset($document['created_at'])) {
            $document['created_at'] = date('Y-m-d H:i:s');
        }
        if (!isset($document['updated_at'])) {
            $document['updated_at'] = date('Y-m-d H:i:s');
        }

        $atlasSuccess = false;
        if ($this->isConnectedToAtlas()) {
            try {
                $bulk = new MongoDB\Driver\BulkWrite();
                $bulk->insert($document);
                $result = $this->manager->executeBulkWrite("{$this->dbName}.{$this->collectionName}", $bulk);
                $atlasSuccess = $result->getInsertedCount() > 0;
            } catch (Exception $e) {
                error_log("MongoDB Atlas Insert error: " . $e->getMessage());
            }
        }

        // Fallback insert / local persistence sync
        $fallbackSuccess = $allowFallback ? $this->fallbackInsert($document) : false;
        return $atlasSuccess || $fallbackSuccess;
    }

    public function updateOne(array $filter, array $updateData): bool {
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        $atlasSuccess = false;

        if ($this->isConnectedToAtlas()) {
            try {
                $bulk = new MongoDB\Driver\BulkWrite();
                $bulk->update($filter, ['$set' => $updateData], ['multi' => false, 'upsert' => true]);
                $result = $this->manager->executeBulkWrite("{$this->dbName}.{$this->collectionName}", $bulk);
                $atlasSuccess = ($result->getModifiedCount() > 0 || $result->getMatchedCount() > 0 || $result->getUpsertedCount() > 0);
            } catch (Exception $e) {
                error_log("MongoDB Atlas Update error: " . $e->getMessage());
            }
        }

        $fallbackSuccess = $this->fallbackUpdate($filter, $updateData);
        return $atlasSuccess || $fallbackSuccess;
    }

    public function deleteOne(array $filter): bool {
        $atlasSuccess = false;

        if ($this->isConnectedToAtlas()) {
            try {
                $bulk = new MongoDB\Driver\BulkWrite();
                $bulk->delete($filter, ['limit' => 1]);
                $result = $this->manager->executeBulkWrite("{$this->dbName}.{$this->collectionName}", $bulk);
                $atlasSuccess = ($result->getDeletedCount() > 0);
            } catch (Exception $e) {
                error_log("MongoDB Atlas Delete error: " . $e->getMessage());
            }
        }

        $fallbackSuccess = $this->fallbackDelete($filter);
        return $atlasSuccess || $fallbackSuccess;
    }

    public function deleteMany(array $filter = []): bool {
        $atlasSuccess = false;

        if ($this->isConnectedToAtlas()) {
            try {
                $bulk = new MongoDB\Driver\BulkWrite();
                $bulk->delete($filter, ['limit' => 0]);
                $result = $this->manager->executeBulkWrite("{$this->dbName}.{$this->collectionName}", $bulk);
                $atlasSuccess = ($result->getDeletedCount() >= 0);
            } catch (Exception $e) {
                error_log("MongoDB Atlas DeleteMany error: " . $e->getMessage());
            }
        }

        $fallbackSuccess = $this->fallbackDelete($filter);
        return $atlasSuccess || $fallbackSuccess;
    }

    public function count(array $filter = []): int {
        return count($this->find($filter));
    }

    // --- Local Fallback Handlers (Guarantees zero downtime while activating MongoDB on Hostinger) ---
    private function fallbackFind(array $filter): array {
        try {
            $pdo = Database::getConnection();
            $table = $this->getTableName();
            $sql = "SELECT * FROM {$table}";
            $params = [];

            if (!empty($filter)) {
                $clauses = [];
                foreach ($filter as $k => $v) {
                    if ($k === '$or' && is_array($v)) {
                        $orClauses = [];
                        foreach ($v as $sub) {
                            foreach ($sub as $sk => $sv) {
                                $orClauses[] = "{$sk} = ?";
                                $params[] = $sv;
                            }
                        }
                        if (!empty($orClauses)) {
                            $clauses[] = '(' . implode(' OR ', $orClauses) . ')';
                        }
                    } else {
                        $clauses[] = "{$k} = ?";
                        $params[] = $v;
                    }
                }
                if (!empty($clauses)) {
                    $sql .= " WHERE " . implode(' AND ', $clauses);
                }
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }

    private function fallbackInsert(array $doc): bool {
        try {
            $pdo = Database::getConnection();
            $table = $this->getTableName();
            $keys = array_keys($doc);
            $cols = implode(', ', $keys);
            $placeholders = implode(', ', array_fill(0, count($keys), '?'));
            $stmt = $pdo->prepare("INSERT INTO {$table} ({$cols}) VALUES ({$placeholders})");
            $values = array_map(function($val) {
                return is_array($val) ? json_encode($val) : $val;
            }, array_values($doc));
            return $stmt->execute($values);
        } catch (Exception $e) {
            return false;
        }
    }

    private function fallbackUpdate(array $filter, array $update): bool {
        try {
            $pdo = Database::getConnection();
            $table = $this->getTableName();
            $setParts = [];
            $params = [];
            foreach ($update as $k => $v) {
                $setParts[] = "{$k} = ?";
                $params[] = is_array($v) ? json_encode($v) : $v;
            }
            $whereParts = [];
            foreach ($filter as $k => $v) {
                $whereParts[] = "{$k} = ?";
                $params[] = is_array($v) ? json_encode($v) : $v;
            }
            $sql = "UPDATE {$table} SET " . implode(', ', $setParts) . " WHERE " . implode(' AND ', $whereParts);
            $stmt = $pdo->prepare($sql);
            return $stmt->execute($params);
        } catch (Exception $e) {
            return false;
        }
    }

    private function fallbackDelete(array $filter): bool {
        try {
            $pdo = Database::getConnection();
            $table = $this->getTableName();
            $whereParts = [];
            $params = [];
            foreach ($filter as $k => $v) {
                $whereParts[] = "{$k} = ?";
                $params[] = $v;
            }
            $sql = "DELETE FROM {$table} WHERE " . implode(' AND ', $whereParts);
            $stmt = $pdo->prepare($sql);
            return $stmt->execute($params);
        } catch (Exception $e) {
            return false;
        }
    }

    private function getTableName(): string {
        switch ($this->collectionName) {
            case 'admin_credentials': return 'admin_credentials';
            case 'users': return 'users';
            case 'orders': return 'orders';
            case 'products': return 'products';
            case 'password_resets': return 'password_resets';
            default: return $this->collectionName;
        }
    }
}

class MongoDBClient {
    public static function getCollection(string $name): MongoDBCollection {
        return new MongoDBCollection($name);
    }
}

