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
