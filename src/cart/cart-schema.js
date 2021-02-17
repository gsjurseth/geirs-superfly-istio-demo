// grab the things we need
import mongoose from 'mongoose';
import uuid from 'uuid-mongodb';

const Schema = mongoose.Schema;

const item = new Schema({
  _id: { type: 'object', value: { type: 'Buffer'  }, default: () => uuid.v4().toString(), required: true },
  ref: { type: 'object', value: { type: 'Buffer'  }, required: true },
  quantity: { type: Number, required: true  }
});

// create a schema
const cartSchema = new Schema({
  _id: { type: 'object', value: { type: 'Buffer'  }, default: () => uuid.v4().toString(), 
    required: true, unique: true, index: true },
  email: { type: String, required: false },
  items: [item]
});

// the schema is useless so far
// we need to create a model using it
let cart = mongoose.model('Cart', cartSchema);

// make this available to our users in our Node applications
module.exports = cart;
