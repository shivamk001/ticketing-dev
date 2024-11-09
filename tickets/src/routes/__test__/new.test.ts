import request from 'supertest';
import {app} from '../../app';
import { response } from 'express';

it('has a router handler listening to /api/tickets', async ()=>{
    const response=await request(app)
                    .post('/api/tickets')
                    .send({})

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async ()=>{
    const response=await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({});
    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid titled is provided', async ()=>{
    await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: '', print: 10})
            .expect(400)
    
    await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({print: 10})
            .expect(400)
});

it('returns an error if an invalid price is provided', async ()=>{
    await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: 'advsjnvds', print: -10})
            .expect(400);

    await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({title: 'advsjnvds'})
            .expect(400);
});

it('create a ticket with valid inputs', async ()=>{});