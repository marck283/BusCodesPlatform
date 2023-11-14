import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

// set up a mongoose model
export default model('Driver', new Schema({ 
	idazienda: String,
    idutente: String
}));