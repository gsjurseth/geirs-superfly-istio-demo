import express from 'express';
import mongoose from 'mongoose';
import warehouse from './warehouse-schema.js';
import bp from 'body-parser';

let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;

mongoose.connect(`mongodb://${mongohost}:${mongoport}/test`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


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

app.get('/warehouse/:name', (req, res) => {
  warehouse
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

app.put('/warehouse/:name', (req, res) => {
  warehouse
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

app.delete('/warehouse', (req, res) => {
  if ( req.query.id ) {
    warehouse
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

app.delete('/warehouse/:name', (req, res) => {
  warehouse
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
