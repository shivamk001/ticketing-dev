import express, {Response, Request} from 'express';
import jwt from 'jsonwebtoken';
import { RequestValidationError, validationRequest, BadRequestError,  } from '@shivamkesarwani001/ticketing_common';

import { body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../services/password';

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
    async (req: Request, res: Response)=>{
        const { email, password } = req.body;

        const existingUser = await User.findOne({email});
        if(!existingUser){
            throw new BadRequestError('Invalid Credentials');
        }

        const passwordsMatch=await Password.compare(existingUser.password, password);
        
        if(!passwordsMatch){
            throw new BadRequestError('Invalid Credentials');
        }

        //generate jwt
        const userJWT=jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
        }, process.env.JWT_KEY!)

        // store it on session object
        req.session={
            jwt: userJWT
        }

        res.status(200).send(existingUser);
})

export { router as signInRouter};