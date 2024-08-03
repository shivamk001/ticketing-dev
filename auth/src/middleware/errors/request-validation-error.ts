import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError{
    statusCode=400
    constructor(public errors: ValidationError[]){
        super('Invalid parameters');

        // because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeError(): {message: string, field?: string}[]{
        console.log(this.errors.map(error=>{
            if(error.type=='field'){   
                return {
                    message: error.msg,
                    field: error.path
                }
            }
        }));
        return this.errors.map(error=>{
            if(error.type=='field'){   
                return {
                    message: error.msg,
                    field: error.path
                }
            }else{
                return {
                    message: error.msg
                }
            }
        })
    }
}