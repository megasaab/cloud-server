import path from 'path';

export const PORT = process.env.CLOUD_PORT || 5001;
export const MONGO_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/cloud-server';
export const MONGODB_USER = process.env.MONGO_INITDB_ROOT_USERNAME || 'root';
export const MONGODB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD || 'root';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '12dm,gjjssshe933-dsal,__2';
export const FILE_PATH = process.env.FILE_PATH || path.join(__dirname, 'files');