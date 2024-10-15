import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

let router = express.Router();

router.get('/auth/users/currentuser', 
    (req: Request, res: Response)=>{
        if(!req.session?.jwt)
            res.send({currentUser: null});

        try{
            const payload=jwt.verify(req.session?.jwt, process.env.JWT_KEY!);
            res.send({currentUser: payload});
        }
        catch(err){
            res.send({currentUser: null});
        }
    })

// router.post('/auth/users/currentuser', 
//     [
//         body('email')
//         .isEmail()
//         .withMessage('Email must be valid'),
//         body('password')
//         .trim()
//         .isLength({min: 4, max: 20})
//         .withMessage('Password must be between 4 and 20')
//     ],
// (req: Request, res: Response)=>{
//     const error = validationResult(req);

//     if(!error.isEmpty()){
//         return res.status(400)
//                 .send(error.array());
//     }
//     const {email, password} = req.body;
//     res.send({});
// })

export { router as currentUserRouter};