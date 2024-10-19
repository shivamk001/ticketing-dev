import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
// connect with mongodb memory server
beforeAll(async ()=>{
    process.env.JWT_KEY='asdf';
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