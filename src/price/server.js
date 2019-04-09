import express from 'express';
import mongoose from 'mongoose';
import price from './price-schema.js';
import bp from 'body-parser';

let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;

mongoose.connect(`mongodb://${mongohost}:${mongoport}/test`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.get('/price', (req, res) => {
  price
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

app.post('/price', (req, res) => {
  let myPrice = new price(req.body)
  myPrice.save()
   .then(doc => {
     console.log(doc)
     return res.json(doc);
   })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/price/:name', (req, res) => {
  price
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

app.put('/price/:name', (req, res) => {
  price
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
    console.log(doc)
    return res.json(doc);
  })
  .catch(err => {
    console.error(err)
    return res.status(500).send(err);
  });
});

app.delete('/price', (req, res) => {
  if ( req.query.id ) {
    price
    .findByIdAndRemove( req.query.id )
    .then(response => {
      console.log(response);
      return res.json(response);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
  }
  else {
    return res.status(400).send("missing id");
  }
});

app.delete('/price/:name', (req, res) => {
  price
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
