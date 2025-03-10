import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// CONNECT WITH MONGODB
const start = async ()=>{
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

        process.on('SIGINT', ()=>natsWrapper.client.close());
        process.on('SIGINT', ()=>natsWrapper.client.close());
    }
    catch(err){
        console.error(err);
    }
}

start();