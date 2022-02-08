export const PORT = process.env.CLOUD_PORT || 5001;
export const MONGO_URL = process.env.MONGODB_URL || 'mongodb://mongoDataBase:27017/cloud-api';
export const MONGODB_USER = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
export const MONGODB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD || 'root';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '12dm,gjjssshe933-dsal,__2'