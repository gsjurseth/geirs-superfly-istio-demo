import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import warehouse from './warehouse-schema.js';

let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;
let mongouser = process.env.MONGO_USERNAME || 'user';
let mongopass = process.env.MONGO_PASSWORD || 'pass';

mongoose.connect(`mongodb://${mongouser}:${mongopass}@${mongohost}:${mongoport}/aMagicDB`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


app.options('/warehouse', cors());
app.options('/warehouse/:name', cors());

app.use(express.json());
app.get('/warehouse', (req, res) => {
  warehouse
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

app.post('/warehouse', (req, res) => {
  warehouse.insertMany(req.body)
   .then(doc => {
     console.log(doc)
     return res.json(doc);
   })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/warehouse/:id', (req, res) => {
  warehouse.findOne({_id: req.params.id})
    .then(doc => {
      console.log(doc);
      return res.json(doc);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    });
});

app.put('/warehouse/:id', (req, res) => {
  warehouse
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
    return res.json(doc);
  })
  .catch(err => {
    console.error(err)
    return res.status(500).send(err);
  });
});

app.delete('/warehouse', (req, res) => {
  warehouse.deleteMany()
    .then( x => {
      console.log(x);
      return res.json(x);
    })
    .catch( err => {
      console.error(err)
      return res.status(400).send({ msg: "done fucked up: ", error: err} );

    })
  });

app.delete('/warehouse/:id', (req, res) => {
  warehouse
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
