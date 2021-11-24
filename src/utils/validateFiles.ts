import fs from 'fs'

const validateFiles = function (filePathList : string[]) {

    for(let filePath of filePathList){
     
        if(!fs.existsSync(filePath)){
            throw new Error(`Arquivo ${filePath} não encontrado!`);
        }
    }
}

export default validateFiles;