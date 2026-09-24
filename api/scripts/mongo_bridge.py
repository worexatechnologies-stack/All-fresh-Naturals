import sys
import json
import os
import pymongo

URI = os.getenv("MONGODB_URI") or "mongodb://sachinworexa_db_user:lq6CbUx8UOxqasmt@ac-qt0l01o-shard-00-00.lxdljg7.mongodb.net:27017,ac-qt0l01o-shard-00-01.lxdljg7.mongodb.net:27017,ac-qt0l01o-shard-00-02.lxdljg7.mongodb.net:27017/fresh_naturals_db?authSource=admin&replicaSet=atlas-2vs44h-shard-0&tls=true&retryWrites=true&w=majority"
DB_NAME = os.getenv("MONGODB_DB") or "fresh_naturals_db"

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input and len(sys.argv) > 1:
            raw_input = sys.argv[1]
        if not raw_input:
            print(json.dumps({"success": False, "error": "No input payload"}))
            return
        payload = json.loads(raw_input)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Invalid JSON: {e}"}))
        return

    action = payload.get("action")
    collection_name = payload.get("collection")
    filter_query = payload.get("filter", {})

    try:
        client = pymongo.MongoClient(URI, serverSelectionTimeoutMS=4000)
        db = client[DB_NAME]
        col = db[collection_name]

        if action == "find":
            cursor = col.find(filter_query)
            docs = []
            for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                docs.append(doc)
            print(json.dumps({"success": True, "data": docs}))

        elif action == "findOne":
            doc = col.find_one(filter_query)
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            print(json.dumps({"success": True, "data": doc}))

        elif action == "insertOne":
            doc = payload.get("document", {})
            res = col.insert_one(doc)
            print(json.dumps({"success": True, "inserted_id": str(res.inserted_id)}))

        elif action == "updateOne":
            update_data = payload.get("update", {})
            do_upsert = payload.get("upsert", False)
            res = col.update_one(filter_query, {"$set": update_data}, upsert=do_upsert)
            print(json.dumps({"success": True, "modified_count": res.modified_count, "upserted_id": str(res.upserted_id) if res.upserted_id else None}))

        elif action == "deleteOne":
            res = col.delete_one(filter_query)
            print(json.dumps({"success": True, "deleted_count": res.deleted_count}))

        elif action == "deleteMany":
            res = col.delete_many(filter_query)
            print(json.dumps({"success": True, "deleted_count": res.deleted_count}))

        else:
            print(json.dumps({"success": False, "error": f"Unknown action {action}"}))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
