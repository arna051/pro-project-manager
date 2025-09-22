import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project-manager';


type MongooseGlobal = typeof globalThis & {
    _mongooseConn?: Promise<typeof mongoose>;
};

const globalWithMongoose = global as MongooseGlobal;

if (!globalWithMongoose._mongooseConn) {
    globalWithMongoose._mongooseConn = (async () => {
        if (!MONGODB_URI) return mongoose; // no-op connection
        if (mongoose.connection.readyState >= 1) return mongoose;
        await mongoose.connect(MONGODB_URI);
        return mongoose;
    })();
}