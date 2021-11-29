import fs from 'fs'

const shouldHave  = function(filePathList : string[]) {
    verify(filePathList, true);
}

const shouldNotHave = function(filePathList : string[]) {
    verify(filePathList, false);
}

const verify = function (filePathList : string[], shouldHave: boolean = true) {

    for(let filePath of filePathList){
     
        if(!fs.existsSync(filePath) && shouldHave){
            throw new Error(`Arquivo ${filePath} não encontrado!`);
        }else if(fs.existsSync(filePath) && !shouldHave){
            throw new Error(`Arquivo ${filePath} já existe!`);
        }
    }
}


export {shouldHave, shouldNotHave};