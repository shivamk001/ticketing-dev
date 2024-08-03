import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../middleware/errors/request-validation-error';
import { DatabaseConnectionError } from '../middleware/errors/database-connection-error';

let router = express.Router();

router.post('/auth/users/signup',     [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be min 4 max 20')
    ], 
    (req: Request, res: Response)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
            throw new RequestValidationError(error.array());

        console.log('Creating a user...');
        throw new DatabaseConnectionError();
        res.send({});
})

export { router as signUpRouter};