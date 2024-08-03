import express from 'express';
import json from 'body-parser';
import 'express-async-errors'

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './middleware/errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all('*', async (req, res, next)=>{
    next(new NotFoundError());
})
// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

app.listen(3000, ()=>{
    console.log('Listening on port 3000!!');
    
})