// grab the things we need
import mongoose from 'mongoose';
import uuid from 'uuid-mongodb';

const Schema = mongoose.Schema;

// create a schema
const warehouseSchema = new Schema({
  _id: { type: 'object', value: { type: 'Buffer'   }, default: () => uuid.v4(), required: true  },
  md_ref: { type: 'object', value: { type: 'Buffer' }, required: true },
  number: { type: Number, required: true }
});

// the schema is useless so far
// we need to create a model using it
let warehouse = mongoose.model('Warehouse', warehouseSchema);

// make this available to our users in our Node applications
module.exports = warehouse;
