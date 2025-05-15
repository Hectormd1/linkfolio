import mongoose, { Schema } from "mongoose";

export interface IUSer{
    name: string;
    email: string;
    password: string;
}

const userScheme = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
})

const User = mongoose.model<IUSer>('User', userScheme)
export default User