import request  from "supertest";
import mongoose from "mongoose";
import {app} from '../../app';
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";


it('mark an order as cancelled', async ()=>{

    // create a ticket
    const ticket=Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    const user=global.signin();
    // make a request to build an order with ticket
    const { body: order}=await request(app)
                                .post('/api/orders')
                                .set('Cookie', user)
                                .send({ticketId: ticket.id})
                                .expect(201);
    
    // make a request to cancel order
    await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204);

    // expect to make sure the order is cancelled
    const updatedOrder=await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emit an order cancelled event', async ()=>{
    // create a ticket
    const ticket=Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    const user=global.signin();
    // make a request to build an order with ticket
    const { body: order}=await request(app)
                                .post('/api/orders')
                                .set('Cookie', user)
                                .send({ticketId: ticket.id})
                                .expect(201);
    
    // make a request to cancel order
    await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', user)
            .send()
            .expect(204);
            
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})