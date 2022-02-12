import express, { Request, Response, Router } from "express";
import { userSchema } from "../schemas/user";
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../constants";
import { resourceLimits } from "worker_threads";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { fileService } from "../services/fileService";
import { fileSchema } from "../schemas/file";

export const authRouter: Router = express.Router();

authRouter.post('/registration',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'password must be longer than 3 and shorter than 20')
            .isLength({ min: 3, max: 15 })
    ],
    async (req: Request, res: Response) => {
        try {

            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'validation error' });
            }

            const { email, password } = req.body;

            const candidate = await userSchema.findOne({ email });

            if (candidate) {
                res.status(400).json({ message: `User with email ${email} already exist` })
            }


            const hashPassword = await bcrypt.hash(password, 8);
            const user = new userSchema({ email, password: hashPassword });

            await user.save();
            await fileService.createDir(new fileSchema({user: user.id, name: ''}))
            return res.json({ message: "User was created" });

        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    });

authRouter.post('/login',
    async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body;
            const user = await userSchema.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isPassValid = bcrypt.compareSync(password, user.password);

            if (!isPassValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({id: user.id}, JWT_SECRET_KEY, {expiresIn: '1h'});
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                }
            })

        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    });


    authRouter.get('/auth', AuthMiddleware,
    async (req: any, res: Response) => {
        try {
            
            const user = await userSchema.findOne({_id: req.user.id});
            const token = jwt.sign({id: user.id}, JWT_SECRET_KEY, {expiresIn: '1h'});
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                }
            })

        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' });
        }
    });