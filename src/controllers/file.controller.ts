import { Request, Response } from "express";
import { FILE_PATH } from "../constants";
import { fileSchema } from "../schemas/file";
import { userSchema } from "../schemas/user";
import { fileService } from "../services/fileService";
import filepath from "path";
import fs from "fs";
import path from 'path';
import { equal } from "assert";

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
                file.path = path.join(`${parentFile.path}`, `${file.name}`);
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
            const { sort } = req.query;
            let files;
            switch (sort) {
                case '1':
                    files = await fileSchema.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 });
                    break;
                case '-1':
                    files = await fileSchema.find({ user: req.user.id, parent: req.query.parent }).sort({ type: -1 });
                    break;
                default:
                    files = await fileSchema.find({ user: req.user.id, parent: req.query.parent });
                    break;
            }
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
            let filePth = file.name;
            if (parent) {
                filePth = filepath.join(`${parent.path}`, file.name)
            }
            const dbFile = new fileSchema({
                name: file.name,
                type,
                size: file.size,
                path: filePth,
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
            const file = await fileSchema.findOne({ _id: req.query.id, user: req.user.id });
            const pth = path.join(FILE_PATH, `${req.user.id}`, `${file.path}`, `${file.name}`);

            if (fs.existsSync(pth)) {
                res.download(pth, file.name);
            } else {
                return res.status(404).json({ message: 'File not found' });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Download file Error' });
        }
    }

    async deleteFile(req: any, res: Response) {
        try {
            const file = await fileSchema.findOne({ _id: req.query.id, user: req.user.id });
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }
            fileService.deleteFile(file);
            await file.remove();
            return res.json({ message: 'File was deleted' });
        } catch (error) {
            console.log(error);
            return res.json({ message: 'cannot delete' });
        }
    }

    async searchFile(req: any, res: Response) {
        try {
            const searchName = req.query.search;
            let files = await fileSchema.find({user: req.user.id });
            files = files.filter(file => file.name.includes(searchName));
            return res.json(files);

        } catch (error) {
            console.log(error);
            return res.status(400).json({message: 'search error'});
        }
    }




}

export const fileController = new FileController();