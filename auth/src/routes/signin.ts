import express, {Response, Request} from 'express';

let router = express.Router();

router.post('/auth/users/signin', (req: Request, res: Response)=>{
    res.send('Hello there!');
})

export { router as signInRouter};