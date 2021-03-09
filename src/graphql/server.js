import { ApolloServer } from 'apollo-server';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import MasterdataAPI from './datasources/masterdata';
import PricesAPI from './datasources/prices';
import WarehouseAPI from './datasources/warehouse';
import CatalogAPI from './datasources/catalog';
import CartAPI from './datasources/cart';

const DEBUG=process.env.DEBUG || false;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
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

