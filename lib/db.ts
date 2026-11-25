import mongoose from "mongoose";
const MongoDB_URI = process.env.MONGODB_URI

if(!MongoDB_URI){
    throw new Error("Please define the MONGO_URI environment variable inside .env")
}

interface MongooseCache{
    promise:Promise<typeof mongoose> | null;
}

declare global{
    var mongooseCache:MongooseCache;
}

const catched:MongooseCache = global.mongooseCache ?? {promise:null};

if(!global.mongooseCache){
    global.mongooseCache = catched;
}

export default async function connectDB():Promise<typeof mongoose>{
    if(mongoose.connection.readyState >=1){
        return mongoose;
    }
    if(!catched.promise){
        catched.promise = mongoose.connect(MongoDB_URI!,{bufferCommands:false});
    }
    try{
        await catched.promise;
    }catch(e){
        catched.promise = null;
        throw e;
    }
    return mongoose;
}