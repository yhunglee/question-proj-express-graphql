/**
 * Structure
 * id: uuid
 * account: string
 * email: string
 * password: string
 *
 */
const graphql = require("graphql");
const gScalarType = require("graphql-scalars");
const joinMonster = require("join-monster");
const { Node } = require("./Node");

const User = new graphql.GraphQLObjectType({
  name: "User",
  interfaces: [Node],
  extensions: {
    joinMonster: {
      sqlTable: "users",
      uniqueKey: "id",
    },
  },
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLID,
        extensions: {
          joinMonster: {
            sqlColumn: "id",
          },
        },
      },
      email: {
        type: gScalarType.GraphQLEmailAddress,
        extensions: {
          joinMonster: {
            sqlColumn: "email",
          },
        },
      },
      account: {
        type: graphql.GraphQLString,
        extensions: {
          joinMonster: {
            sqlColumn: "account",
          },
        },
      },
      password: {
        type: graphql.GraphQLString,
        extensions: {
          joinMonster: {
            sqlColumn: "password",
          },
        },
      },
    };
  },
});

module.exports = {
  User,
};
