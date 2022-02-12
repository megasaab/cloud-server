import jwt from 'jsonwebtoken';
import { Request, Response }  from 'express';
import { JWT_SECRET_KEY } from '../constants';

export const AuthMiddleware = (req: any, res: Response, next: Function) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: 'Auth error'});
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded
        next();
        
    } catch (error) {
        return res.status(401).json({message: 'Auth Error'});
    }
}