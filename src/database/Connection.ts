import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const connectDatabase = async () => {

    
    if(mongoose.STATES[mongoose.connection.readyState] !== "connected")  // if already connected dont make another connection
        mongoose.connect("mongodb+srv://gabrieldasnevespinheiro:88454720@ritta.2kh3snc.mongodb.net/?retryWrites=true&w=majority");
};

export default connectDatabase;