import express from 'express';
import json from 'body-parser';
import 'express-async-errors'
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@shivamkesarwani001/ticketing_common';

const app = express();
// traffic is being proxied to our app through ingress/nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV!='test'
}))
app.all('/uptime', (req, res)=>{
    res.send('Hello World!')
})

app.all('*', async (req, res, next)=>{
    next(new NotFoundError());
})
// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

export { app };