import express, {Response, Request} from 'express';

let router = express.Router();

router.post('/auth/users/signout', (req: Request, res: Response)=>{
    console.log('SIGNING OUT', req.session);
    
    req.session=null;
    res.send({});
})

export { router as signOutRouter};