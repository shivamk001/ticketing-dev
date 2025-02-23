import mongoose from 'mongoose';

import {app} from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';
import { OrderCancelledListener } from './events/listener/order-cancelled-listener';

// CONNECT WITH MONGODB
const start = async ()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY is undefined');
    }
    if(!process.env.MONGO_URL){
        throw new Error('MONGO_URL is undefined');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID is undefined');
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL is undefined');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID is undefined');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed!');
            process.exit();;
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        process.on('SIGINT', ()=>natsWrapper.client.close());
        process.on('SIGINT', ()=>natsWrapper.client.close());

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