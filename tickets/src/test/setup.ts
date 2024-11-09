import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

let mongo: any;
// connect with mongodb memory server
beforeAll(async ()=>{
    process.env.JWT_KEY='asdf';
    process.env.NODE_ENV='test';
    mongo=await MongoMemoryServer.create();
    const mongoUri=mongo.getUri();
    await mongoose.connect(mongoUri, {})
});

// delete all data between each test
beforeEach(async ()=>{
    if(mongoose.connection.db){
        // get all collections
        const collections=await mongoose.connection.db.collections()

        for(let collection of collections){
            // delete all data for each collection
            await collection.deleteMany({});
        }
    }
});

// stop server and disconnect
afterAll(async ()=>{
    if(mongo){
        await mongo.stop();
    }
    // disconnect
    await mongoose.connection.close();
});

global.signin=()=>{
    // build a jwt payload, {id, email}
    const payload={
        id: 'abcde',
        email: 'test@test.com'
    }

    // create the jwt
    const token=jwt.sign(payload, process.env.JWT_KEY!);

    //build session object
    const session={jwt: token};

    // turn that session into JSON
    const sessionJSON=JSON.stringify(session);

    // take JSON and encode it as base64
    const base64=Buffer.from(sessionJSON).toString('base64');

    // return encoded cookie

    return [`session=${base64}`];
}