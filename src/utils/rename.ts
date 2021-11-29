import fs from 'fs'
import path from 'path';
import { shouldHave } from './validateFiles';

function renameDir(dir: string, placeholder: string, newValue: string, recursive : boolean = true){

    let newDir = dir;
    if(dir.includes(placeholder)){
        newDir = dir.replace(placeholder, newValue);
        fs.renameSync(dir, newDir);
    }

    let files = fs.readdirSync(newDir);

    for(let filename of files){
        
        let filePath = `${newDir}/${filename}`;
        let file = fs.statSync(filePath);
        let newPath = `${newDir}/${filename.replace(placeholder, newValue)}`

        if(filename.includes(placeholder)){
            fs.renameSync(filePath, newPath);
        }

        if(file.isDirectory() && recursive){
            renameDir(newPath, placeholder, newValue, recursive);
        }
    }
}

function renameFile(filePath: string, placeholder: string, newValue: string){
    shouldHave([filePath]);
    let filename = path.basename(filePath)
    if(filename.startsWith(placeholder)){
        let newPath = filePath.replace(placeholder, newValue);
        fs.renameSync(filePath, newPath);
    }
}

export {renameDir, renameFile};