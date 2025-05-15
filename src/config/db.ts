import colors from 'colors'
import mongoose from "mongoose";
import User, {IUSer} from '../models/User';


export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.host}:${connection.port}`
        
        console.log(colors.magenta.bold(`MONGODB CONECTADO en ${url}`))
    } catch (error) {
        console.log(colors.white.bgRed.bold(error.message));
        process.exit(1)
    }
}