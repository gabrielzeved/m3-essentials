import arg from 'arg'
import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import { createComponent } from './main'

interface CLIOptions{
    skipPrompts: boolean,
    template: string
    name: string
}

function parseArgumentsIntoOptions(rawArgs: string[]){
    const args = arg({
        '--yes': Boolean,
        '-y': '--yes'
    },{
        argv: rawArgs.slice(2)
    });
    return {
        skipPrompts: args['--yes'] || false,
        template: args._[0],
        name: args._[1] || ''
    }
}

async function promptForMissingOptions(options : CLIOptions){
    const defaultTemplate = 'css-handles';

    if(options.skipPrompts){
        return{
            ...options,
            template: options.template || defaultTemplate
        }
    }

    const questions = []
    if(!options.name){
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Digite o nome do componente: '
        })
    }

    if(!options.template){
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Escolha um template para seu componente',
            choices: ['css', 'sass', 'css-handles'],
            default: defaultTemplate
        })
    }
    
    const answers = await inquirer.prompt(questions);
    return{
        ...options,
        name: options.name || answers.name,
        template: options.template || answers.template
    }
}

export async function cli(args : string[]){
    let options = parseArgumentsIntoOptions(args);
    clear();
    console.log(
        chalk.green(
            figlet.textSync('M3 Essentials', { horizontalLayout: 'full' })
        )
    );
    options = await promptForMissingOptions(options);
    createComponent(options);
}