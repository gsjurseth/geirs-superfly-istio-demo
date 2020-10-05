const express = require('express'),
      fetch   = require('node-fetch'),
      winston = require('winston');

const app     = express();
const port    = process.env.PORT || 3000;
const DEBUG   = process.env.DEBUG || 'info';

let apikey = "";
const backends = {
  "md": "https://devapi.evils.in/md",
  "price": "https://devapi.evils.in/price",
  "warehouse": "https://devapi.evils.in/warehouse"
};

const logger = winston.createLogger({
  level: DEBUG,
  defaultMeta: { service: 'catalog' },
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

/// Express routing and stuff 
app.use( (req,res,next) => {
  logger.info('setting up internal auth');
  logger.debug('Request headers: %j', req.headers);
  if (req.headers['x-internal-api-key']) {
    apikey = req.headers['x-internal-api-key'];
    logger.debug('This is the internal apikey: %s', apikey);
  }
  else {
    throw new Error('Internal api key must be set in header');
  }

  next();
});

// Error handler
app.use((err, req, res, next) => {
  logger.error( "We failed with error: %s", err );
  res.status(500).json({ "error": err, "code": 500 })
  next();
});

app.get('/', async (req, res) => {
  logger.info('Entering / request');

  let backendPromises = Object.keys(backends).map( async (key) => {
    let request = {
      method: "GET",
      headers: {
        "x-api-key": apikey,
        "accept": "application/json"
      }
    }
    let result = await fetch(backends[key], request)
      .then( x => x.json() )
      .then( x => {
        logger.debug('Our response for url: %s', backends[key],x);
        let y = {};
        y[key] = x;
        return y;
      })
    return result;
  })

  let pResults = await Promise.all(backendPromises);

  // gross and hacky sort
  let results = {};
  pResults.forEach( x => {
    let k = Object.keys(x);
    k.forEach( y => {
      x[y].forEach( item => {
        delete item._id;
        delete item.__v;
        logger.debug('and the item: ', item);
        if ( results[item.name]  ) {
          Object.assign(results[item.name],item);
        }
        else {
          results[item.name] = {};
          Object.assign(results[item.name],item);
        }
      });
    });
  });

  logger.debug('Unparsed results: ', results);
  res.json(results);

});

app.listen(port, () => {
  console.log("And we're starting up");
  console.log(`Example app listening at http://localhost:${port}`);
});
