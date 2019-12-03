import logging
import json
import datetime
from app import mongo_database

class LogsMongoHandler(logging.Handler):
    
    def __init__(self, level = logging.NOTSET):
        logging.Handler.__init__(self, level)
        # self.collection = mongo_backend_logs.db.logs
        self.collection = mongo_database.db.logs

                
    def emit(self, record):
        obj = json.loads(record.msg)
        timestamp_string = obj["timestamp"]
        obj["timestamp"] = datetime.datetime.strptime(timestamp_string, "%d/%b/%Y:%H:%M:%S.%f")
        self.collection.insert_one(obj)




