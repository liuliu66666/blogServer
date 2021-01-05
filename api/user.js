const Router = require("koa-router");
const router = new Router();

const { isEmpty } = require("../utils/utils");
const { query } = require("../utils/db");

// login
router.post("/login", async (ctx) => {

  const { username, password } = ctx.request.body;
  try {
    if (isEmpty(username) || isEmpty(password)) {
      ctx.body = {
        status: -1,
        msg: "用户名密码不能为空",
      };
    } else {
      const result = await query(
        `SELECT * FROM account WHERE username='${username}' AND password='${password}'`
      );
      if (!isEmpty(result)) {
        ctx.session.SESSIONID = result[0].id;
        ctx.body = {
          status: 200,
          result: result[0],
          msg: "登录成功",
        };
      } else {
        ctx.body = {
          status: -1,
          msg: "用户不存在",
        };
      }
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "执行错误",
    };
  }
});

module.exports = router.routes();
