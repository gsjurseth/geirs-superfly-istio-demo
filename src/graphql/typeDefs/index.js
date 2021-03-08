import { gql } from 'apollo-server';

// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Masterdata {
    id: ID!
    name: String
    desc: String
    img: String
  }

  type Query {
    md: [Masterdata]
  }
`;

export default typeDefs;