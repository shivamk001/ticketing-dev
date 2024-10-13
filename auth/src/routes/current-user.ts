import express, {Response, Request} from 'express';
import { body, validationResult } from 'express-validator';

let router = express.Router();

router.post('/auth/users/currentuser', 
(req: Request, res: Response)=>{
    res.send('Hello World');
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