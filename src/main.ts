import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { fileURLToPath } from 'url';
import { promisify } from 'util'
import Listr from 'listr'

const access = promisify(fs.access);
const copy = promisify(ncp)
async function copyTemplateFiles(options : any){
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

async function renameFiles(options: any){

}

export async function createComponent(options: any){

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    const templateUrl = path.resolve(
        //@ts-expect-error
        fileURLToPath(import.meta.url),
        '../../src/templates',
        options.template.toLowerCase()
    )
    options.templateDirectory = templateUrl;

    try{
        await access(templateUrl, fs.constants.R_OK);
    } catch(err){
        console.log(err);
         console.error('%s Invalid template name', chalk.red.bold('ERROR'));
         process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copy template files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Renaming template files',
            task: () => renameFiles(options)
        }
    ])

    await tasks.run();

    console.log('%s Component ready', chalk.green.bold('DONE'));
    return true;
}