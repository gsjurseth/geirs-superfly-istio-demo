import { axios } from 'axios';
import staticMDs from '../typeDefs/md.json';

// grab our env vars or set them to defaults
/*
const ev = {
    mdURL: `http://${process.env.MD_HOST || 'localhost'}:${process.env.MD_PORT || 3000}/md`,
    whURL: `http://${process.env.WH_HOST || 'localhost'}:${process.env.WH_PORT || 3000}/warehouse`,
    priceURL: `http://${process.env.PRICE_HOST || 'localhost'}:${process.env.PRICE_PORT || 3000}/md`,
    cartURL: `http://${process.env.CART_HOST || 'localhost'}:${process.env.CART_PORT || 3000}/md`,
    KEY: `${process.env.APIKEY}`
}
*/

const resolvers = {
    Query: {
        masterdata: (_, __, { dataSources }) =>
          dataSources.MasterdataAPI.getMasterdata(),
        masterdataById: (_, {id}, { dataSources }) =>
          dataSources.MasterdataAPI.getMasterdataById(id),
        masterdataByName: (_, {name}, { dataSources }) =>
          dataSources.MasterdataAPI.getMasterdataByName(name),
        prices: (_, __, { dataSources }) =>
          dataSources.PricesAPI.getPrices(),
        priceById: (_, {id}, { dataSources }) =>
          dataSources.PricesAPI.getPriceById(id),
        stock: (_, __, { dataSources }) =>
          dataSources.WarehouseAPI.getStock(),
        stockById: (_, {id}, { dataSources }) =>
          dataSources.WarehouseAPI.getStockById(id),
        catalog: (_, __, { dataSources }) =>
          dataSources.CatalogAPI.getCatalog(),
        catalogItemById: (_, {id}, { dataSources }) =>
          dataSources.CatalogAPI.getCatalogItemById(id),
        catalogItemByName: (_, {name}, { dataSources }) =>
          dataSources.CatalogAPI.getCatalogItemByName(name),
        cartByEmail: (_, {email}, { dataSources }) =>
          dataSources.CartAPI.getCartByEmail(email),
      }
}

export default resolvers;