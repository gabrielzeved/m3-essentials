import fs from 'fs';
import { shouldHave } from './validateFiles';

const writeInJson = function(filePath: string, object: any, overwrite : boolean = true){

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