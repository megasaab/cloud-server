import fs from 'fs';
import { resolve } from 'path/posix';
import { FILE_PATH } from '../constants';
import { FileI, fileSchema } from '../schemas/file';

class FileService {
    

    createDir(file: FileI): Promise<any> {
        const filePath = `${FILE_PATH}\\${file.user}\\${file.path}`;
        
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, {recursive: true});
                    return resolve({message: 'File was created'});
                } else {
                    return reject({message: 'File already exists' });
                }
                
            } catch (error) {
                return reject({message: 'File error'});
            }   
        });
    }
}


export const fileService = new FileService();