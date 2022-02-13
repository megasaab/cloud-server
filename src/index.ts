import express, { json } from 'express';
import mongoose from 'mongoose';
import { FILE_PATH, MONGODB_PASS, MONGODB_USER, MONGO_URL, PORT } from './constants';
import { authRouter } from './routes/auth.routes';
import cors from 'cors';
import { fileRouter } from './routes/file.routes';
import fileUpload from 'express-fileupload';

const app = express();

app.use(fileUpload({}));
app.use(cors());
app.use(json()); // for parsing application/json
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

const init = async (): Promise<void> => {
    console.log(FILE_PATH)
    app.listen(PORT, () => {
        console.log(`cloud service listen on port ${PORT}`);
    });
};

const initDb = async (): Promise<void> => {
    mongoose.connect(MONGO_URL, {
        auth: { password: MONGODB_PASS, username: MONGODB_USER },
        autoIndex: true,
        authSource: 'admin',
    }).then(() => console.log('database connected')).catch((e) => {
        console.log(e);
    });
};

const start = async () => {
    await init();
    await initDb();
};


start();