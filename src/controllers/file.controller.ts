import { Response } from "express";
import { FILE_PATH } from "../constants";
import { fileSchema } from "../schemas/file";
import { userSchema } from "../schemas/user";
import { fileService } from "../services/fileService";
import filepath from "path";
import fs from "fs";
import path from 'path';

class FileController {
    async createDir(req: any, res: Response) {
        try {
            const { name, type, parent } = req.body;
            const file = new fileSchema({
                name, type, parent, user: req.user.id
            });
            const parentFile = await fileSchema.findOne({ _id: parent });
            if (!parentFile) {
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
            return res.status(400).json(error);
        }
    }

    async fetchFiles(req: any, res: Response) {
        try {
            const files = await fileSchema.find({ user: req.user.id, parent: req.query.parent });
            return res.json(files);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Can not get files" });
        }
    }

    async uploadFile(req: any, res: Response) {
        try {
            const file = req.files.file;

            const parent = await fileSchema.findOne({ user: req.user.id, _id: req.body.parent });
            const user = await userSchema.findOne({ _id: req.user.id });

            if (user.userdSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: 'There no space on the disk' })
            }

            user.userdSpace = user.userdSpace + file.size;

            let path;
            if (parent) {
                path = filepath.join(FILE_PATH, `${user._id}`, `${parent.path}`, `${file.name}`);
            } else {
                path = filepath.join(FILE_PATH, `${user._id}`, `${file.name}`);
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'File already exist' })
            }

            file.mv(path);

            const type = file.name.split('.').pop();
            const dbFile = new fileSchema({
                name: file.name,
                type,
                size: file.size,
                path: parent?.path,
                parent: parent?._id,
                user: user._id
            });

            await dbFile.save();
            await user.save();

            res.json(dbFile);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Upload error" });
        }
    }

    async downloadFile(req: any, res: Response) {
        try {
            const file = await fileSchema.findOne({_id: req.query.id, user: req.user.id});
            const pth =  path.join(FILE_PATH, `${req.user.id}`,  `${file.path}`, `${file.name}`);

            if (fs.existsSync(pth)) {
                res.download(pth, file.name);
            }

            return res.status(40).json({message: 'File not found'});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Download file Error'});
        }
    }


}

export const fileController = new FileController();