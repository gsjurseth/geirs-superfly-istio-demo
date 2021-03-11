import { gql } from 'apollo-server';

// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Cart {
    items: [CartItem]
    email: String!
    id: ID!
  }

  type CartItem {
    id: ID!
    md: CatalogItem!
    quantity: Int!
  }

  type CatalogItem {
    md_id: ID!
    name: String!
    desc: String!
    img: String
    price: Int
    stock: Int
  }

  type Masterdata {
    md_id: ID!
    name: String
    desc: String
    img: String
  }

  type Price {
    id: ID
    price: Int
    md: Masterdata
  }
    #name: String

  type Stock {
    id: ID
    amount: Int
    name: String
    md: Masterdata
  }

  type Query {
    masterdata: [Masterdata]
    masterdataById(id: ID!): Masterdata
    masterdataByName(name: String!): Masterdata
    prices: [Price]
    priceById(id: ID!): Price
    stock: [Stock]
    stockById(id: ID!): Stock
    catalog: [CatalogItem]
    catalogItemById(id: ID!): CatalogItem
    catalogItemByName(name: String!): CatalogItem
    cartByEmail(email: String!): Cart
  }
`;

export default typeDefs;