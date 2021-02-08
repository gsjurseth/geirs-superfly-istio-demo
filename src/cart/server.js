import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cart from './cart-schema.js';

let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;
let mongouser = process.env.MONGO_USERNAME || 'user';
let mongopass = process.env.MONGO_PASSWORD || 'pass';

mongoose.connect(`mongodb://${mongouser}:${mongopass}@${mongohost}:${mongoport}/aMagicDB`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


app.options('/cart', cors());
app.options('/cart/:name', cors());

app.use(express.json());
app.get('/cart', (req, res) => {
  cart
  .find()
  .then(doc => {
    console.log(doc);
    return res.json(doc);
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  });
});

app.post('/cart', (req, res) => {
  cart.insertMany(req.body)
   .then(doc => {
     console.log(doc)
     return res.json(doc);
   })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/cart/:name', (req, res) => {
  cart
  .find({
    name: req.params.name 
  })
  .then(doc => {
    console.log(doc);
    return res.json(doc);
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  });
});

app.put('/cart/:name', (req, res) => {
  cart
  .findOneAndUpdate(
    {
      name: req.params.name
    }, 
    Object.assign({},req.body)
    ,
    {
      new: true,                       // return updated doc
    })
  .then(doc => {
    return res.json(doc);
  })
  .catch(err => {
    console.error(err)
    return res.status(500).send(err);
  });
});

app.delete('/cart', (req, res) => {
  cart.deleteMany()
    .then( x => {
      console.log(x);
      return res.json(x);
    })
    .catch( err => {
      console.error(err)
      return res.status(400).send({ msg: "done fucked up: ", error: err} );

    })
  });

app.delete('/cart/:name', (req, res) => {
  cart
  .findOneAndRemove({
    name: req.params.name
  })
  .then(response => {
    console.log(response);
    return res.json(response);
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  })
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
