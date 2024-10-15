import express, {Response, Request} from 'express';
import jwt from 'jsonwebtoken';

import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../middleware/errors/request-validation-error';
import { validationRequest } from '../middleware/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../middleware/errors/bad-request-error';
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

        const passwordsMatch=Password.compare(existingUser.password, password);

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