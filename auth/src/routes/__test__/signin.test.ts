import request from 'supertest';
import { app } from '../../app';

it('fails when an email that doesnt exist is supplied', async ()=>{
    return request(app)
            .post('/auth/users/sign')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(404);
});

it('fails when an incorrect password is supplied', async ()=>{
    // signup
    const response = await request(app)
        .post('/auth/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
    // signin
    const response2=await request(app)
            .post('/auth/users/signin')
            .send({
                email: 'test@test.com',
                password: 'wrongpass'
            })
            .expect(400);
});

it('response with a cookie when given valid credentials', async ()=>{
    // signup
    await request(app)
        .post('/auth/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    // signin
    let response=await request(app)
            .post('/auth/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});