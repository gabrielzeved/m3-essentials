import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { fileURLToPath } from 'url';
import { promisify } from 'util'
import Listr from 'listr'
//@ts-expect-error dont have typings
import replace from 'string-replace-stream'
import rename from './utils/rename'
import validateFiles from './utils/validateFiles';
import writeInJson from './utils/writeJson';
import _ from 'lodash'

const access = promisify(fs.access);
const copy = promisify(ncp)

const defaultName = 'COMPONENT_NAME'

const necessaryFiles = [
    'custom/store/interfaces.json'
]

async function copyTemplateFiles(options : any){
    return copy(options.templateDirectory, options.targetDirectory, {
        transform: function (read, write) { read.pipe(replace(defaultName, options.name)).pipe(write) },
        clobber: false
    })
}

async function renameFiles(options: any){
    rename(options.targetDirectory, defaultName, options.name);
}

async function editVtexFiles(options: any){
    try{
        let key = `m3-` + _.kebabCase(options.name);
        writeInJson('./custom/store/interfaces.json', 
            {
                [key]:{
                    "component": options.name
                }
            }
        )
        
    }catch{
        console.error('%s pasta de execução inválida, verifique se está na pasta raiz e execute novamente', chalk.red.bold('ERROR'));
        process.exit(1);
    }
}

async function verifyFiles(){
    try{
        validateFiles(necessaryFiles)
    }catch(err : any){
        console.error('%s ' + err.message, chalk.red.bold('ERROR'));
        process.exit(1);
    }
}

export async function createComponent(options: any){

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    const templateUrl = path.resolve(
        //@ts-expect-error
        fileURLToPath(import.meta.url),
        '../templates',
        options.template.toLowerCase()
    )

    options.templateDirectory = templateUrl;

    try{
        await access(templateUrl, fs.constants.R_OK);
    } catch(err){
         console.error('%s Invalid template name', chalk.red.bold('ERROR'));
         process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Validating files',
            task: () => verifyFiles()
        },
        {
            title: 'Copy template files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Renaming template files',
            task: () => renameFiles(options)
        },
        {
            title: 'Editing VTEX files',
            task: () => editVtexFiles(options)
        }
    ])

    await tasks.run();

    console.log('%s Component ready', chalk.green.bold('DONE'));
    return true;
}