import express from 'express';
import json from 'body-parser';
import 'express-async-errors'

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@shivamkesarwani001/ticketing_common';

const app = express();
// traffic is being proxied to our app through ingress/nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV!='test',
    domain: process.env.COOKIE_DOMAIN
}))
app.all('/uptime', (req, res)=>{
    res.send(`Hello World! ${process.env.COOKIE_DOMAIN}`);
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

export { app };