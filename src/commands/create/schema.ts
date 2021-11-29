import { Templates } from "./typings";

const commandSchema = {
    type: "object",
    properties:{
        template: {
            type: "string",
            enum: Object.values(Templates)
        },
        name: {
            type: "string"
        }
    }
}

export default commandSchema;