import { Request, Response } from "express";
import { fileSchema } from "../schemas/file";
import { fileService } from "../services/fileService";

class FileController {
    async createDir(req: any, res: Response) {
        try {
            const { name, type, parent } = req.body;
            const file = new fileSchema({
                name, type, parent, user: req.user.id 
            });
            const parentFile = await fileSchema.findOne({_id: parent});
            if(!parentFile) {
                file.path = name;
                await fileService.createDir(file);
            } else {
                file.path = `${parentFile.path}\\${file.name}`;
                await fileService.createDir(file);
                parentFile.childs.push(file._id);
                await parentFile.save();
            }
            await file.save();
            return res.json(file);
        } catch (error) {
            console.log(error);
            return res.status(400).json();
        }
    }
}

export const fileController = new FileController();