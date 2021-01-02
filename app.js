const koa = require("koa");
const Router = require("koa-router");
const bodyparser = require("koa-bodyparser");
const koacors = require("koa-cors");

// 实例化koa
const app = new koa();
const router = new Router();

// 引入api
const articleApi = require("./api/article");

router.get("/", (ctx) => {
  ctx.body = {
    msg: "hellow world",
  };
});

// 配置路由地址
router.use("/api/article", articleApi);

app.use(
  bodyparser({
    enableTypes: ["json", "form"],
  })
);
app.use(koacors());
// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
