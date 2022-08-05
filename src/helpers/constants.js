/**
 * ref. link:
 * https://medium.com/@estrada9166/return-custom-errors-with-status-code-on-graphql-45fca360852
 * */
const errorName = {
  "Not Authorised!": "Not Authorised!",
  UNAUTHORIZED: "UNAUTHORIZED",
  NO_MATCHED_USER: "no matched user",
  WRONG_PASSWORD: "wrong password",
  NEW_PASSWORD_IS_SAME_AS_CURRENT: "New password is same as current",
  NOT_FOUND_RESOURCE: "no found resource",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  NO_CSRF_TOKEN: "Header has no CSRF token",
};

const errorType = {
  "Not Authorised!": {
    message: "Not Authorised!",
    statusCode: 401,
  },
  UNAUTHORIZED: {
    message: "Authentication is needed to get requested response",
    statusCode: 401,
  },
  "no matched user": {
    message: "No existed user",
    statusCode: 404,
  },
  "wrong password": {
    message: "Password is wrong",
    statusCode: 400,
  },
  "New password is same as current": {
    message: "",
    statusCode: 400,
  },
  "no found resource": {
    message: "Not found resource you want, please check request again",
    statusCode: 404,
  },
  UNKNOWN_ERROR: {
    message: "It happens unknown error, please contact system admin.",
    statusCode: 500,
  },
  "Header has no CSRF token": {
    message: "Header has no CSRF token",
    statusCode: 400,
  },
};

module.exports = {
  errorName,
  errorType,
};
