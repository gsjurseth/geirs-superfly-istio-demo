// grab the things we need
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create a schema
const cartSchema = new Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true }
});

// the schema is useless so far
// we need to create a model using it
let cart = mongoose.model('Cart', cartSchema);

// make this available to our users in our Node applications
module.exports = cart;
