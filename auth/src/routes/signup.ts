import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { RequestValidationError } from '../middleware/errors/request-validation-error';
import { DatabaseConnectionError } from '../middleware/errors/database-connection-error';
import { BadRequestError } from '../middleware/errors/bad-request-error';
import { User } from '../models/user';

let router = express.Router();

router.post('/auth/users/signup',     [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be min 4 max 20')
    ], 
    async (req: Request, res: Response)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
            throw new RequestValidationError(error.array());

        console.log('Creating a user...');
        const { email, password }=req.body;
        const existingUser=await User.findOne({email});

        if(existingUser){
            console.log('Email in use!');
            throw new BadRequestError('Email in use'); 
        }

        const user=User.build({email, password});
        await user.save();

        // generate JWT
        const userJWT=jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        // store it on session object
        req.session={
            jwt: userJWT
        };
        
        res.status(201).send(user);
})

export { router as signUpRouter};