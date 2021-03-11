import { ApolloServer } from 'apollo-server';
import { RedisClusterCache } from 'apollo-server-cache-redis';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import MasterdataAPI from './datasources/masterdata';
import PricesAPI from './datasources/prices';
import WarehouseAPI from './datasources/warehouse';
import CatalogAPI from './datasources/catalog';
import CartAPI from './datasources/cart';

const DEBUG         = process.env.DEBUG       || false;
const REDIS_HOST    = process.env.REDIS_HOST  || 'localhost';
const REDIS_NS      = process.env.REDIS_NS    || 'redis';
const REDIS_NODES   = process.env.REDIS_NODES || 1;
const REDIS_PORT    = process.env.REDIS_PORT  || 6379;
const REDIS_PASS    = process.env.REDIS_PASS  || 'supersecret';

let redisHosts = [];

let i = 0;
for (i = 0; i < REDIS_NODES; i++) {
  redisHosts.push( `${REDIS_HOST}-${i}.${REDIS_NS}`);
}

if (DEBUG) console.log("Using redis port %s and hosts: %j", REDIS_PORT, redisHosts);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  cache: new RedisClusterCache(
    redisHosts.map( h => {
      return {
        "port": REDIS_PORT,
        "host": h,
        "password": REDIS_PASS
      };
    },
    )
  ),
  dataSources: () => {
    return {
      MasterdataAPI: new MasterdataAPI(DEBUG),
      PricesAPI: new PricesAPI(DEBUG),
      WarehouseAPI: new WarehouseAPI(DEBUG),
      CatalogAPI: new CatalogAPI(DEBUG),
      CartAPI: new CartAPI(DEBUG),
    }
  },
  tracing: true
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

