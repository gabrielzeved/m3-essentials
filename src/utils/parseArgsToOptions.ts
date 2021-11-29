import { parse } from "path/posix";

function fix_key(key : string) { return `--${key}` }

const parseArgsToBooleanOptions = function( options : any) {
    let optionsBoolean : any = {}
    Object.keys(options)
    .filter((key) => typeof options[key] == "boolean")
    .forEach(key => {
        optionsBoolean = {
            ...optionsBoolean,
            [key]: options[key]
        }
    }); 

    const obj = Object.assign(
        {},
        ...Object.keys(optionsBoolean)
        .map(key => ({[fix_key(key)]: optionsBoolean[key]}))
    )
    return obj;
}

const parseArgsToOptions = function<Type>( args: any[], defaultOptions : any ) : Type{
    try{
        let obj : any = {};
        Object.keys(defaultOptions).forEach((key, index) => {
            
            let testCast = args[index] as (typeof key);
            if(testCast)
                obj = {
                    ...obj,
                    [key]: testCast
                }
            else
                throw new Error("Os tipos de argumentos não batem com a interface provida!");
        });
        return obj;
    }catch{
        throw new Error("Os tipos de argumentos não batem com a interface provida!");
    }
}

export {parseArgsToOptions, parseArgsToBooleanOptions};