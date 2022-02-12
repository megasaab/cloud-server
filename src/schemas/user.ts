import mongoose, { Schema } from "mongoose";

const User = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    files: [{type: Schema.Types.ObjectId, ref: 'File'}]
});

export const userSchema = mongoose.model('User', User);

export interface UserI {
    email: string;
    password: string;
    diskSpace: number;
    usedSpace: number;
    avatar: string;
    files: any[];
}