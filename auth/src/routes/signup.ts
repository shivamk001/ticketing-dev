import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { RequestValidationError, BadRequestError, validationRequest, DatabaseConnectionError} from '@shivamkesarwani001/ticketing_common';

import { User } from '../models/user';

let router = express.Router();

router.post('/auth/users/signup',     [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be min 4 max 20')
    ], 
    validationRequest,
    async (req: Request, res: Response)=>{
        const error=validationResult(req);

        if(!error.isEmpty()){
            throw new RequestValidationError(error.array());
        }

        const { email, password }=req.body;
        const existingUser=await User.findOne({email});

        if(existingUser){
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