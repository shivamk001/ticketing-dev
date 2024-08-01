import express, {Response, Request} from 'express';

let router = express.Router();

router.post('/auth/users/signout', (req: Request, res: Response)=>{
    res.send('Hello there!');
})

export { router as signOutRouter};