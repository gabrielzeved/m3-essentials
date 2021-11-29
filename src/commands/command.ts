import Ajv, { ValidateFunction } from "ajv";
import inquirer, { Question, QuestionCollection } from 'inquirer';

const ajv = new Ajv({allErrors: true});

abstract class Command<Type>{
    defaultValue: Type | undefined
    validate: ValidateFunction<unknown> | undefined
    schema: any

    constructor(defaultValue : Type, schema: any){
        this.defaultValue = defaultValue;
        this.schema = schema;

        if(this.schema){
            this.validate = ajv.compile(schema);
        }

    }

    parseIntoCommand(args : string[]) : Type{
        const parsed = {} as Type;

        if(!this.defaultValue || !this.validate){
            throw new Error('Comando mal configurado!');
        }

        Object.keys(this.defaultValue).forEach((key, index) => {
            //@ts-expect-error
            parsed[key] = args[index] || this.defaultValue[key];
        });
        return parsed;
    }

    validateSchema(options : Type){

        if(!this.validate){
            throw new Error('Comando mal configurado!');
        }

        const valid = this.validate(options);
        if(!valid){
            throw new Error('Os argumentos fornecidos são inválidos!');
        }
    }

    async askQuestions(options: Type, questions: QuestionType){
        const necessaryQuestions : QuestionCollection = [];
        Object.keys(questions).forEach((key) => {
            //@ts-expect-error
            if(!options[key]) necessaryQuestions.push(questions[key]);
        });
        return inquirer.prompt(necessaryQuestions);
    }

    handle(args: string[]){
        const options = this.parseIntoCommand(args);
        this.call(options);
    }

    abstract call(options: Type) : void;

}

export default Command;
export type QuestionType = { [key: string]: Question | {choices : string[]} };