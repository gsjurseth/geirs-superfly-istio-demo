import { axios } from 'axios';
import staticMDs from '../typeDefs/md.json';

// grab our env vars or set them to defaults
const ev = {
    mdURL: `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`,
    whURL: `http://${process.env.WH_HOST || 'localhost'}:${process.env.WH_PORT || 3000}/warehouse`,
    priceURL: `http://${process.env.PRICE_HOST || 'localhost'}:${process.env.PRICE_PORT || 3000}/md`,
    cartURL: `http://${process.env.CART_HOST || 'localhost'}:${process.env.CART_PORT || 3000}/md`,
    KEY: `${process.env.APIKEY}`
}

const resolvers = {
    Query: {
        md: (_, __, { dataSources }) =>
          dataSources.MasterdataAPI.getMasterdata()
      }
}

export default resolvers;