import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import CreateCommand from './commands/create'

const commands = {
    create: new CreateCommand()
}

export async function cli(args : string[]){
    clear();
    console.log(
        chalk.green(
            figlet.textSync('M3 Essentials')
        )
    );

    const realArgs = args.slice(2);
    commands['create'].handle(realArgs);
}