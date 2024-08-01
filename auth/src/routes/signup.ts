import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';

let router = express.Router();

router.post('/auth/users/signup',     [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be min 4 max 20')
    ], 
    (req: Request, res: Response)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
            return res.status(400).send(error.array())
        res.send('Hello there!');
})

export { router as signUpRouter};