# Question project using express-graphql

- This is backend API without any html file.
- I want to use CSRF token mechanism to protect some mutaiton.
- Highlights about files
  - `src/helpers/Permission/permission.js` is used for checking permission. I want to check CSRF token here so I create `isContainEllegibleCSRFToken()` with package `graphql-shield`.
  - `src/server.js` is the entry file for `express server` execution. It contains many configurations such as session and graphiql.
  - `src/schema/index.js` contains schema of both query and mutation.
