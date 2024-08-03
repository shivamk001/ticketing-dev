import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError{
    reason="Error connecting to databse";
    statusCode=500;
    constructor(){
        super("Error connecting to databse");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError(){
        return [
            {
                message: this.reason
            }
        ]
    }
}