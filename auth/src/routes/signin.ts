import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../middleware/errors/request-validation-error';
import { validationRequest } from '../middleware/validate-request';

let router = express.Router();

router.post('/auth/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('EMail must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validationRequest,
    (req: Request, res: Response)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            throw new RequestValidationError(errors.array());
        }
})

export { router as signInRouter};