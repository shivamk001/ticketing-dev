import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError{
    statusCode=404;
    constructor(){
        super('Router not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError(): { message: string; field?: string; }[] {
        return [{
            message: 'Not Found'
        }]
    }
}