import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async()=>{
        const authResponse= await request(app)
                .post('/auth/users/signup')
                .send({
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(201)
        
        const cookie=authResponse.get('Set-Cookie');
        console.log('Cookie:', cookie);
        if(!cookie)
            throw new Error('Cookie not set');

        const response=await request(app)
                .post('/auth/users/currentuser')
                .set('Cookie', cookie)
                .send()
                .expect(200)

        expect(response.body.currentuser.email).toEqual('test@test.com');
})