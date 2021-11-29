import { promisify } from "util";
import fs from 'fs'
import ncp from 'ncp'
import Command, { QuestionType } from "../command";
import commandSchema from "./schema";
import { CreateCommandOptions, DefaultCreateValues, Templates } from "./typings";
import _ from 'lodash'
import { renameDir, renameFile } from "../../utils/rename";
import writeInJson from './../../utils/writeJson';
import chalk from "chalk";
import { shouldHave, shouldNotHave } from "../../utils/validateFiles";
import path from "path";
import Listr from "listr";
import { fileURLToPath } from "url";
import { CUSTOM_REACT_PATH, CUSTOM_STORE_PATH, PLACEHOLDER } from "./vars";

//@ts-expect-error
import replace from 'string-replace-stream';

class CreateCommand extends Command<CreateCommandOptions>{

    access = promisify(fs.access);
    copy = promisify(ncp)

    constructor(){
        super(DefaultCreateValues, commandSchema);
    }

    copyTemplateFiles(options: CreateCommandOptions, templateDirectory: string){
        return this.copy(templateDirectory, options.targetDirectory + '\\' + CUSTOM_REACT_PATH, {
            transform: function (read, write) { read.pipe(replace(PLACEHOLDER, options.name)).pipe(write) },
            clobber: false
        })
    }

    async renameFiles(options: any){
        renameFile(options.targetDirectory + '\\' + CUSTOM_REACT_PATH + PLACEHOLDER + '.tsx', PLACEHOLDER, options.name);
        renameDir(options.targetDirectory + '\\' + CUSTOM_REACT_PATH + 'components\\' + PLACEHOLDER, PLACEHOLDER, options.name);
    }

    async editVtexFiles(options: any){
        try{
            let key = `m3-` + _.kebabCase(options.name);
            writeInJson(CUSTOM_STORE_PATH + 'interfaces.json', 
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

    async verifyFiles(options : any){
        try{
            
            const necessaryFiles = [
                CUSTOM_STORE_PATH + 'interfaces.json'
            ]
            shouldHave(necessaryFiles)
    
            const filesThatCantExist = [
                CUSTOM_REACT_PATH + options.name + '.tsx'
            ]
            shouldNotHave(filesThatCantExist)
        }catch(err : any){
            console.error('%s ' + err.message, chalk.red.bold('ERROR'));
            process.exit(1);
        }
    }

    async call(options : CreateCommandOptions) {

        const questions : QuestionType = {
            name: {
                type: 'input',
                name: 'name',
                message: 'Digite o nome do componente: '                
            },
            template: {
                type: 'list',
                name: 'template',
                message: 'Escolha um template para seu componente',
                choices: Object.values(Templates),
                default: Templates.CSS_HANDLES
            }
        }

        const answers = await this.askQuestions(options, questions);

        options = {
            ...options,
            ...answers,
            targetDirectory: process.cwd(),
        }

        const templateUrl = path.resolve(
            //@ts-expect-error
            fileURLToPath(import.meta.url),
            '../../../templates',
            options.template.toLowerCase()
        )

        try{
            await this.access(templateUrl, fs.constants.R_OK);
        } catch(err){
             console.error('%s Invalid template name', chalk.red.bold('ERROR'));
             process.exit(1);
        }

        const tasks = new Listr([
            {
                title: 'Checking files',
                task: () => this.verifyFiles(options)
            },
            {
                title: 'Copy template files',
                task: () => this.copyTemplateFiles(options, templateUrl)
            },
            {
                title: 'Renaming template files',
                task: () => this.renameFiles(options)
            },
            {
                title: 'Editing VTEX files',
                task: () => this.editVtexFiles(options)
            }
        ])
    
        await tasks.run();
    
        console.log('%s Component ready', chalk.green.bold('DONE'));
    }

}

export default CreateCommand;
