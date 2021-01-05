const Router = require("koa-router");
const router = new Router();

const { isEmpty } = require("../utils/utils");
const { query, selectAllById } = require("../utils/db");

router.get("/article/list", async (ctx) => {
  const { id } = ctx.request.query;
  try {
    const result = await query(`SELECT * FROM article WHERE type='PUBLISH'`);
    ctx.body = {
      status: 200,
      msg: "查询成功",
      result: result || [],
    };
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "查询失败",
    };
  }
});

router.get("/article", async (ctx) => {
  console.log(`${new Date()} 查询文章列表`, ctx.request.query);
  const { id } = ctx.request.query;
  try {
    if (id) {
      const result = await selectAllById("article", id);
      console.log(`${new Date()} result`, result);

      ctx.body = {
        status: 200,
        msg: "查询成功",
        result: isEmpty(result) ? {} : result[0],
      };
    } else {
      ctx.body = {
        status: -1,
        msg: "查询失败",
      };
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "查询失败",
    };
  }
});

module.exports = router.routes();
