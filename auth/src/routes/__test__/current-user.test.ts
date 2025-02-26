import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async()=>{

        const cookie=await global.signin();

        if(!cookie)
        throw new Error('Cookie not set');

        const response=await request(app)
                .get('/auth/users/currentuser')
                .set('Cookie', cookie)
                .send()
                .expect(200)
        
                expect(response.body.currentUser.email).toEqual('test@test.com');
})