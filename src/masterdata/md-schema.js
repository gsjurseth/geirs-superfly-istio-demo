// grab the things we need
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// create a schema
const masterdataSchema = new Schema({
  name: String,
  desc: String,
  imgUrl: String
});

// the schema is useless so far
// we need to create a model using it
let md = mongoose.model('Masterdata', masterdataSchema);

// make this available to our users in our Node applications
module.exports = md;
