import express from 'express';
import json from 'body-parser';
import 'express-async-errors'
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './middleware/errors/not-found-error';

const app = express();
// traffic is being proxied to our app through ingress/nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}))
app.all('/uptime', (req, res)=>{
    res.send('Hello World!')
})
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all('*', async (req, res, next)=>{
    next(new NotFoundError());
})
// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

// CONNECT WITH MONGODB
const start = async ()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is undefined');
    }
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    }
    catch(err){
        console.error(err);
    }
}

app.listen(3000, ()=>{
    console.log('Listening on port 3000!!');
    
})

start();