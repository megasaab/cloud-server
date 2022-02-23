import fs from 'fs';
import { resolve } from 'path/posix';
import path from 'path';
import { FILE_PATH } from '../constants';
import { FileI, fileSchema } from '../schemas/file';

class FileService {


    createDir(file: FileI): Promise<any> {
        const filePath = this.getPath(file);

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                    return resolve({ message: 'File was created' });
                } else {
                    return reject({ message: 'File already exists' });
                }

            } catch (error) {
                return reject({ message: 'File error' });
            }
        });
    }

    deleteFile(file: FileI) {
        const path = this.getPath(file);
        if (file.type === 'dir') {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    getPath(file: FileI) {
        return path.join(FILE_PATH, `${file.user}`, `${file.path}`);
    }

}
export const fileService = new FileService();