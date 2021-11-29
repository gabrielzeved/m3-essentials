export enum Templates{
    CSS_HANDLES = 'css-handles',
    CSS = 'css',
    SASS = 'sass'
}

export const DefaultCreateValues = {
    template: '',
    name: '',
    targetDirectory: ''
}

export type CreateCommandOptions = typeof DefaultCreateValues;