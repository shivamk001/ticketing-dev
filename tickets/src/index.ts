import mongoose from 'mongoose';

import {app} from './app';
import { natsWrapper } from './nats-wrapper';

// CONNECT WITH MONGODB
const start = async ()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is undefined');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URL is undefined');
    }
    try{
        await natsWrapper.connect('ticketing', 'laskjf', 'http://nats-srv:4222');

        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed!');
            process.exit();;
        })

        process.on('SIGINT', ()=>natsWrapper.client.close());
        process.on('SIGINT', ()=>natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(err){
        console.error(err);
    }
}

app.listen(3000, ()=>{
    console.log('Listening on port 3000!!');
    
})

start();