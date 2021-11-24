import fs from 'fs';

const writeInJson = function(filePath: string, object: any, overwrite : boolean = true){

    if(!fs.existsSync(filePath)){
        throw new Error(`Arquivo ${filePath} não encontrado!`);
    }

    let file = fs.readFileSync(filePath);

    let JsonObject = JSON.parse(file.toString());

    if(overwrite)
        JsonObject = {
            ...JsonObject,
            ...object
        }
    else
        JsonObject = {
            ...object,
            ...JsonObject
        }

    fs.writeFileSync(filePath, JSON.stringify(JsonObject, null, '\t'));
}

export default writeInJson;