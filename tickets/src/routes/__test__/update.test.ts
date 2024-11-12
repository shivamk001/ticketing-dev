import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

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