// grab the things we need
import mongoose from 'mongoose';
import uuid from 'uuid-mongodb';

const Schema = mongoose.Schema;

// create a schema
const masterdataSchema = new Schema({
  _id:  { type: 'object', value: { type: 'Buffer'   }, default: () => uuid.v4(), required: true  },
  name: { type: String, required: true  },
  desc: { type: String, required: true  },
  img:  { type: String, required: true  }
});

// the schema is useless so far
// we need to create a model using it
let md = mongoose.model('Masterdata', masterdataSchema);

// make this available to our users in our Node applications
module.exports = md;
