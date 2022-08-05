const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { schema } = require("./schema/index");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const KnexSessionStore = require("connect-session-knex")(session);

const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const bcrypt = require("bcrypt");
const { getErrorCode } = require("./helpers/error");
const { errorName } = require("./helpers/constants");
const { db } = require("./helpers/db");
const cors = require("cors");

const sessionStoreDB = new KnexSessionStore({
  knex: db,
  tablename: "sessions",
});

/**
 * For passport registering and unregistering
 * user information to session
 * ==== start
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  let matchedUser = await db("users").where("id", id).returning("*");
  [matchedUser] = [...matchedUser];

  done(null, matchedUser);
});
/**
 * For passport registering and unregistering
 * user information to session
 * ==== end
 */

/**
 * For passport with graphql
 * using graphql-passport
 * ==== start
 */
passport.use(
  new GraphQLLocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
      /**
       * Find matched user via email.
       * If there is no matched, return error with done().
       * If there is found one, further compare
       * passwords between founded and one within request
       * by bcrypt's compareSync().
       * If the compare result is true, return
       * null and matchedUser with done().
       *
       */
      let matchedUser = await db(`users`).where("email", email).returning("*");
      [matchedUser] = [...matchedUser];
      let error = null;
      if (matchedUser === undefined) {
        error = new Error(errorName.NO_MATCHED_USER);
        return done(error);
      }

      let compareResult = bcrypt.compareSync(password, matchedUser.password);

      error =
        matchedUser && compareResult
          ? null
          : new Error(errorName.WRONG_PASSWORD);

      done(error, matchedUser);
    }
  )
);
/**
 * For passport with graphql
 * using graphql-passport
 * ==== end
 */

/**
 * For express integrating passport
 * and session start
 */
const app = express();

app.use(cors(corsOptionsDelegate));

app.use(
  session({
    name: "apicookie", // 定義 cookie 名稱
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    unset: "destroy",
    store: sessionStoreDB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 10,
      httpOnly: false, // false 代表讓瀏覽器 js 能看到 cookie
      sameSite: false,
      secure: false,
    },
    genid: () => uuidv4(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * For express integrating passport
 * and session end
 */

/**
 * For express integrating graphql
 * start
 */
app.use(
  "/api",
  graphqlHTTP(function (req, res, params) {
    return {
      schema,
      graphiql: true,
      context: buildContext({ req, res, csrf }),
      customFormatErrorFn: (err) => {
        /**
         * respond custom error message
         */
        console.log(`err: ${JSON.stringify(err)}`); // debug
        const error = getErrorCode(err.message);
        return { message: error.message, statusCode: error.statusCode };
      },
    };
  })
);
app.listen(49999);
