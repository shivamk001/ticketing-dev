import express from 'express';
import json from 'body-parser';
import 'express-async-errors'
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@shivamkesarwani001/ticketing_common';

import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

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

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res, next)=>{
    next(new NotFoundError());
})
// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

export { app };