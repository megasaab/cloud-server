import express, { json } from 'express';
import mongoose from 'mongoose';
import { MONGODB_PASS, MONGODB_USER, MONGO_URL, PORT } from './constants';
import { authRouter } from './routes/auth.routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json()); // for parsing application/json
app.use('/api/auth', authRouter);

const init = async (): Promise<void> => {
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