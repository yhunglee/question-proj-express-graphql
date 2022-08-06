const { shield, rule, and, allow } = require("graphql-shield");
const { errorName } = require("../constants");

/**
 * 是否包含合格的 CSRF token
 */

const isContainEllegibleCSRFToken = rule({ cache: "contextual" })(
  async (parent, args, { csrf, req } /* Notice: context variable */, info) => {
    let result = true;
    try {
      // result = req.header["csrf-token"] === csrf();
      const { value } = csrf();
      console.log(`====`); // debug

      result = value(req);

      console.log(`result: ${result}`); // debug
    } catch (error) {
      return new Error(errorName.NO_CSRF_TOKEN);
    }
    return !!result;
  }
);

/**
 * 是登入
 */
const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return await ctx.isAuthenticated();
  }
);

const permissions = shield(
  {
    QueryRoot: {
      users: and(isAuthenticated),
    },
    MutationRoot: {
      login: allow,
      changeUserPassword: and(isAuthenticated, isContainEllegibleCSRFToken),
    },
  },
  {
    /**
     * 當 debug == false 時，代表不啟用除錯模式。
     * 如果要回傳客製化錯誤訊息，請在 resolve 函式使用 回傳(return) 錯誤。
     * 當 debug == true 時，代表啟用除錯模式，
     * 會捕捉在 resolve 函式 丟出(throw)的錯誤訊息。
     */
    debug: false, // 必須要設定成 true , 才能正確判斷 錯誤訊息.
    allowExternalErrors: true,
  }
);

module.exports = {
  permissions,
};
