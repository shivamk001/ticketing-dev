import mongoose from 'mongoose';

import {app} from './app';

// CONNECT WITH MONGODB
const start = async ()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is undefined');
    }
    if(!process.env.MONGO_URL){
        throw new Error('MONGO_URL is undefined');
    }
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }
    catch(err){
        console.error(err);
    }
}

app.listen(3000, ()=>{
    console.log('Listening on port 3000!!');
    
})

start();