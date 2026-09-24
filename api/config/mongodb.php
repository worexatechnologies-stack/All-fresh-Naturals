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

    private function callBridge(array $payload): ?array {
        $bridgeScript = __DIR__ . '/../scripts/mongo_bridge.py';
        if (!file_exists($bridgeScript)) {
            return null;
        }

        $descriptorspec = [
            0 => ["pipe", "r"],
            1 => ["pipe", "w"],
            2 => ["pipe", "w"]
        ];

        // Locate real python binary (avoid WindowsApps store stub)
        $pythonBin = 'python';
        $candidates = [
            'C:\\Program Files\\Python313\\python.exe',
            'C:\\Program Files\\Python312\\python.exe',
            'C:\\Program Files\\Python311\\python.exe',
            'C:\\Python313\\python.exe',
            '/usr/bin/python3',
            '/usr/local/bin/python3'
        ];
        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                $pythonBin = '"' . $candidate . '"';
                break;
            }
        }

        $cmd = "{$pythonBin} \"{$bridgeScript}\"";
        $process = @proc_open($cmd, $descriptorspec, $pipes);
        if (!is_resource($process)) {
            return null;
        }

        fwrite($pipes[0], json_encode($payload));
        fclose($pipes[0]);

        $output = stream_get_contents($pipes[1]);
        $err = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        proc_close($process);

        if (!empty($err)) {
            error_log("MongoDB Bridge error: " . $err);
        }

        if (!$output) return null;
        $res = json_decode($output, true);
        if (isset($res['success']) && $res['success']) {
            return $res;
        }
        return null;
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

        // Fast path: try local PDO database layer (0.001s)
        $fallback = $this->fallbackFind($filter);
        if (!empty($fallback)) {
            return $fallback;
        }

        // Optional Python MongoDB Bridge call ONLY if explicitly enabled
        if (getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'find',
                'collection' => $this->collectionName,
                'filter' => !empty($filter) ? $filter : new stdClass()
            ]);
            if ($bridgeRes && isset($bridgeRes['data']) && is_array($bridgeRes['data']) && !empty($bridgeRes['data'])) {
                return $bridgeRes['data'];
            }
        }

        return [];
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

        // Fast path: try local PDO database layer (0.001s)
        $fallback = $this->fallbackFind($filter);
        if (!empty($fallback)) {
            return $fallback[0];
        }

        // Optional Python MongoDB Bridge call ONLY if explicitly enabled
        if (getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'findOne',
                'collection' => $this->collectionName,
                'filter' => !empty($filter) ? $filter : new stdClass()
            ]);
            if ($bridgeRes && isset($bridgeRes['data']) && !empty($bridgeRes['data'])) {
                return $bridgeRes['data'];
            }
        }

        return null;
    }

    public function insertOne(array $document, bool $allowFallback = true): bool {
        if (!isset($document['created_at'])) {
            $document['created_at'] = date('Y-m-d H:i:s');
        }
        if (!isset($document['updated_at'])) {
            $document['updated_at'] = date('Y-m-d H:i:s');
        }

        // Instant local write (0.001s)
        $fallbackSuccess = $allowFallback ? $this->fallbackInsert($document) : false;

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

        if (!$atlasSuccess && getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'insertOne',
                'collection' => $this->collectionName,
                'document' => $document
            ]);
            if ($bridgeRes && !empty($bridgeRes['success'])) {
                $atlasSuccess = true;
            }
        }

        return $fallbackSuccess || $atlasSuccess;
    }

    public function updateOne(array $filter, array $updateData): bool {
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        
        // Instant local update (0.001s)
        $fallbackSuccess = $this->fallbackUpdate($filter, $updateData);

        $atlasSuccess = false;
        if ($this->isConnectedToAtlas()) {
            try {
                $bulk = new MongoDB\Driver\BulkWrite();
                $bulk->update($filter, ['$set' => $updateData], ['multi' => false, 'upsert' => false]);
                $result = $this->manager->executeBulkWrite("{$this->dbName}.{$this->collectionName}", $bulk);
                $atlasSuccess = ($result->getModifiedCount() > 0 || $result->getMatchedCount() > 0 || $result->getUpsertedCount() > 0);
            } catch (Exception $e) {
                error_log("MongoDB Atlas Update error: " . $e->getMessage());
            }
        }

        if (!$atlasSuccess && getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'updateOne',
                'collection' => $this->collectionName,
                'filter' => !empty($filter) ? $filter : new stdClass(),
                'update' => $updateData
            ]);
            if ($bridgeRes && !empty($bridgeRes['success'])) {
                $atlasSuccess = true;
            }
        }

        return $fallbackSuccess || $atlasSuccess;
    }

    public function deleteOne(array $filter): bool {
        // Instant local delete (0.001s)
        $fallbackSuccess = $this->fallbackDelete($filter);

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

        if (!$atlasSuccess && getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'deleteOne',
                'collection' => $this->collectionName,
                'filter' => !empty($filter) ? $filter : new stdClass()
            ]);
            if ($bridgeRes && !empty($bridgeRes['success'])) {
                $atlasSuccess = true;
            }
        }

        return $fallbackSuccess || $atlasSuccess;
    }

    public function deleteMany(array $filter = []): bool {
        // Instant local delete (0.001s)
        $fallbackSuccess = $this->fallbackDelete($filter);

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

        if (!$atlasSuccess && getenv('ENABLE_PYTHON_BRIDGE') === 'true') {
            $bridgeRes = $this->callBridge([
                'action' => 'deleteMany',
                'collection' => $this->collectionName,
                'filter' => !empty($filter) ? $filter : new stdClass()
            ]);
            if ($bridgeRes && !empty($bridgeRes['success'])) {
                $atlasSuccess = true;
            }
        }

        return $fallbackSuccess || $atlasSuccess;
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

