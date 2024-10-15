import express, {Response, Request} from 'express';

let router = express.Router();

router.post('/auth/users/signout', (req: Request, res: Response)=>{
    req.session=null;
    res.send({});
})

export { router as signOutRouter};