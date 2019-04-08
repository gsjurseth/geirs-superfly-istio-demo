import express from 'express';
import mongoose from 'mongoose';
import md from './md-schema.js';
import bp from 'body-parser';

mongoose.connect(`mongodb://${process.env.mongohost}/test`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.get('/', (req, res) => {
  md
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

app.post('/', (req, res) => {
  let myMD = new md(req.body)
  myMD.save()
   .then(doc => {
     console.log(doc)
     return res.json(doc);
   })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/:name', (req, res) => {
  md
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

app.put('/:name', (req, res) => {
  md
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

app.delete('/:name', (req, res) => {
  md
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
