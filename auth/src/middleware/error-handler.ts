import { Request, Response, NextFunction} from 'express';
import { CustomError } from './errors/custom-error';

export const errorHandler=(
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction)=>{

    console.log(err instanceof CustomError);
    if(err instanceof CustomError){
        return res.status(err.statusCode).send({
            errors: err.serializeError()
        })
    }
    return res.status(400).send({
        errors: [{
            message: 'Something went wrong'
        }]
    })   
}