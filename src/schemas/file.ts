import mongoose, { Schema } from "mongoose";


const File = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    accessLink: {type: String},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    parent: {type: Schema.Types.ObjectId, ref: 'User'},
    childs: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

export const fileSchema = mongoose.model('File', File);


export interface FileI {
    name: string;
    type: string;
    accessLink: string;
    size: number;
    path: string;
    user: any;
    parent: any;
    childs: any[];
}
