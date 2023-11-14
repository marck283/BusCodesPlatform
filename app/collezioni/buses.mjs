import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

// set up a mongoose model
export default model('Buses', new Schema({
    targa: String,
    capacita: Number,
    numPersone: Number
}));