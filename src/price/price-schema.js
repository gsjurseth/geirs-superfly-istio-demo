// grab the things we need
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create a schema
const priceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// the schema is useless so far
// we need to create a model using it
let price = mongoose.model('Price', priceSchema);

// make this available to our users in our Node applications
module.exports = price;
