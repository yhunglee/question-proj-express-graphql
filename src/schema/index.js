const graphql = require("graphql");
const { applyMiddleware } = require("graphql-middleware");
const { permissions } = require("../helpers/Permission/permission");

let schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "QueryRoot",
    fields: () => ({
      listOfUsers: {
        type: graphql.GraphQLList(User),
        resolve: (parent, args, context, resolveInfo) => {
          // listing of users
        },
      },
    }),
  }),
  mutation: new graphql.GraphQLObjectType({
    name: "MutationRoot",
    fields: () => ({
      login: {
        type: User,
        args: {
          email: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          password: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        },
        resolve: async (parent, { email, password }, context) => {
          const { user } = await context.authenticate("graphql-local", {
            email,
            password,
          });
          await context.login(user);
          return user;
        },
      },
      changeUserPassword: {
        type: User,
        args: {
          oldPassword: { type: graphql.GraphQLString },
          newPassword: { type: graphql.GraphQLString },
        },
        resolve: async (parent, { oldPassword, newPassword }, context) => {
          // do change password
        },
      },
    }),
  }), // Notice: name must same as one declared within GraphQLObjectType
});

schema = applyMiddleware(schema, permissions);

module.exports = {
  schema,
};
