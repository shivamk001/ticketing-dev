import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it('returns a 404 if the provided id does not exist', async()=>{
        const id=new mongoose.Types.ObjectId().toHexString();
        await request(app)
                .put(`/api/tickets/${id}`)
                .set('Cookie', global.signin())
                .send({title: 'vcvjwdb', price: 20})
                .expect(404)
})

it('returns a 401 if the user is not authenticated', async()=>{
        const id=new mongoose.Types.ObjectId().toHexString();
        await request(app)
                .put(`/api/tickets/${id}`)
                .send({title: 'vcvjwdb', price: 20})
                .expect(401);
})

it('returns a 401 if the user does not own the ticket', async()=>{

        const response=await request(app)
                .post(`/api/tickets`)
                .set('Cookie', global.signin())
                .send({title: 'vcvjwdb', price: 20})

        await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie', global.signin())
                .send({title: 'vcvjwdfcqab', price: 200})
                .expect(401);
})

it('returns a 400 if the user provides an invalid title or price', async()=>{
        const cookie=global.signin();

        const response=await request(app)
                .post(`/api/tickets`)
                .set('Cookie', cookie)
                .send({title: 'vcvjwdb', price: 20});

        await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie', global.signin())
                .send({title: '', price: 200})
                .expect(400);
        
        await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie', global.signin())
                .send({title: 'new title', price: -200})
                .expect(400);
})

it('updates the tickets provided valid input', 
        async()=>{
                const cookie=global.signin();

                const response=await request(app)
                        .post(`/api/tickets`)
                        .set('Cookie', cookie)
                        .send({title: 'vcvjwdb', price: 20});

                await request(app)
                        .put(`/api/tickets/${response.body.id}`)
                        .set('Cookie', cookie)
                        .send({title: 'new title', price: 200})
                        .expect(200);
                
                const ticketResponse=await request(app)
                        .get(`/api/tickets/${response.body.id}`)
                        .expect(200);

                expect(ticketResponse.body.title).toEqual('new title');
                expect(ticketResponse.body.price).toEqual(200);
})

it('publishes an event', async ()=>{
        const cookie=global.signin();

        const response=await request(app)
                .post(`/api/tickets`)
                .set('Cookie', cookie)
                .send({title: 'vcvjwdb', price: 20});

        await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie', cookie)
                .send({title: 'new title', price: 200})
                .expect(200);
        
        expect(natsWrapper.client.publish)
                .toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async ()=>{
        const cookie=global.signin();

        const response=await request(app)
                .post(`/api/tickets`)
                .set('Cookie', cookie)
                .send({title: 'vcvjwdb', price: 20});

        const ticket=await Ticket.findById(response.body.id);

        ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});

        await ticket!.save();

        await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie', global.signin())
                .send({title: 'new title', price: 200})
                .expect(400);
})