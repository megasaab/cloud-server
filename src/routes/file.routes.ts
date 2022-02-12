import express, { Request, Response, Router } from "express";
import { fileController } from "../controllers/file.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const fileRouter: Router = express.Router();

fileRouter.post('', AuthMiddleware, fileController.createDir);
fileRouter.get('', AuthMiddleware, fileController.fetchFiles);