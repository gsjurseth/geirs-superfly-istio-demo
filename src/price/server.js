import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import price from './price-schema.js';
import bp from 'body-parser';

let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;
let mongouser = process.env.MONGO_USERNAME || 'user';
let mongopass = process.env.MONGO_PASSWORD || 'pass';

mongoose.connect(`mongodb://${mongouser}:${mongopass}@${mongohost}:${mongoport}/aMagicDB`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;

app.options('/price', cors());
app.options('/price/:name', cors());

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
  price.insertMany(req.body)
   .then(doc => {
     console.log(doc)
     return res.json(doc);
   })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/price/:id', (req, res) => {
  price.findOne({_id: req.params.id})
    .then(doc => {
      console.log(doc);
      return res.json(doc);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

app.put('/price/:id', (req, res) => {
  price
  .findOneAndUpdate(
    {
      _id: req.params.id
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
  price.deleteMany()
    .then( x => {
      console.log(x);
      return res.json(x);
    })
    .catch( err => {
      console.error(err)
      return res.status(400).send({ msg: "done fucked up: ", error: err} );

    })
  });

app.delete('/price/:id', (req, res) => {
  price
  .findOneAndRemove({
    _id: req.params.id
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
