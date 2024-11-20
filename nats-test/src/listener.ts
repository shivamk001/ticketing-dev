import nats, { Message } from "node-nats-streaming";

const stan=nats.connect('ticketing', 'abc', {
    url: "http://localhost:4222"
})

stan.on('connect', ()=>{
    console.log('Listener connected to NATS');

    const subscription=stan.subscribe('ticket:created', 'orders-service-queue-group');

    subscription.on('message', (msg: Message)=>{

        const data=msg.getData();

        if(typeof data === 'string'){
            console.log(`Received event #${msg.getSequence()} with data: ${data}`);
        }
        console.log('Message Received');
    })
})