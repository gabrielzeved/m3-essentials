import fs from 'fs'

function rename(dir: string, placeholder: string, newValue: string){

    let files = fs.readdirSync(dir);

    for(let filename of files){
        
        let filePath = `${dir}/${filename}`;
        let file = fs.statSync(filePath);
        let newPath = `${dir}/${filename.replace(placeholder, newValue)}`

        if(filename.startsWith(placeholder)){
            fs.renameSync(filePath, newPath);
        }

        if(file.isDirectory()){
            rename(newPath, placeholder, newValue);
        }
    }
}

export default rename;