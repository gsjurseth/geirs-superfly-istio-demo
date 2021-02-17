import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import md from './md-schema.js';
import {Storage} from '@google-cloud/storage';
import mimetypes from 'mimetypes';
import jimp from 'jimp';

// Instantiate a storage client
const storage     = new Storage();
const GCS_BUCKET  = process.env.BUCKET || 'geirs-purdy-project_zoinks';
const bucketName  = GCS_BUCKET;
const bucket      = storage.bucket(bucketName);

async function existsBucket(b) {
  // Lists all buckets in the current project

  const [buckets] = await storage.getBuckets();
  return buckets.map(bucket => bucket.name).includes(b);
}

existsBucket(bucketName)
  .then( bool => {
    if ( bool === false) {
      bucket.create().then(function(data) {
        const bucket = data[0];
        const apiResponse = data[1];

        console.log("the bucket: ", bucket);
        console.log("the apiResponse: ", apiResponse);
      });
    }
    else {
      console.log("Found bucket: %s", bucketName);
    }
  });


let mongohost = process.env.mongohost || 'localhost';
let mongoport = process.env.mongoport || 27017;
let mongouser = process.env.MONGO_USERNAME || 'user';
let mongopass = process.env.MONGO_PASSWORD || 'pass';

mongoose.connect(`mongodb://${mongouser}:${mongopass}@${mongohost}:${mongoport}/aMagicDB`, {useNewUrlParser: true});


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.options('/md', cors());
app.options('/md/:name', cors());

function processImg(img) {
  return jimp.read( img )
    .then( img => {
      return img.quality(60).scaleToFit(128,128).getBufferAsync(jimp.MIME_JPEG);
    });
}

// return the img url (could be what was sent in, otherwise return false)
async function imgHandler(r) {
  let u = new URL(r.img)
  let url = r.img;
  if ( u.protocol === 'data:' ) {

    // Create a new file in the bucket and upload the file data.
    let mt = u.href.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
    let extension = mimetypes.detectExtension(mt);
    //let filename = `${r.name}.${extension}`;
    let filename = `${r.name}.jpeg`;
    let file = bucket.file(`${filename}`);

    let data = Buffer.from(u.href.split(',')[1], 'base64')

    let jimg = await processImg(data);
    
    await file.save(jimg, {
      metadata: { contentType: mt },
      public: true,
      validation: 'md5'
    })

    let md = await file.getMetadata();
    url = await md[0].mediaLink;
    console.log("the url for the gcs saved image is: ", url);
    return url;
  }
  else {
    return url;
  }
}

async function insertEm(b) {
  return  await md.insertMany( b );
}

app.get('/md', cors(), (req, res) => {
  md
  .find()
  .then(doc => {
    console.log(doc);
    res.json(doc);
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  });
});

/*
 * gracefully handle both singles and arrays
 * also deal with images: could be a url or a proper image
 */
app.post('/md', cors(), async (req, res) => {

  let b = [];//req.body;
  if (!(Array.isArray(req.body))) {
    let d = req.body;
    req.body = [d];
  }

  for await( let e of req.body ) {
    e.img = await imgHandler(e);
    b.push(e);
  }
  
  insertEm(b).then( x => {
    console.log(x);
    res.json(x);
  })
   .catch(err => {
     console.error(err)
     return res.status(500).send(err);
   });
});

app.get('/md/:name', cors(), (req, res) => {
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

app.put('/md/:name', cors(), (req, res) => {
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

app.delete('/md/:name', cors(), (req, res) => {
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
