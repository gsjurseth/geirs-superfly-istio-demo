// grab the things we need
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create a schema
const warehouseSchema = new Schema({
  name: String,
  number: Number
});

// the schema is useless so far
// we need to create a model using it
let warehouse = mongoose.model('Warehouse', warehouseSchema);

// make this available to our users in our Node applications
module.exports = warehouse;
