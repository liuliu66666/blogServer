const koa = require("koa");
const Router = require("koa-router");
const bodyparser = require("koa-bodyparser");
const koacors = require("koa-cors");
const koa_session = require("koa-session2");

const Store = require("./utils/store");
const auth = require("./midware/needauth");

// 实例化koa
const app = new koa();
const router = new Router();

// 引入api
const articleApi = require("./api/article");
const userApi = require("./api/user");
const blogApi = require("./api/blog");

// 配置路由地址
router.use("/api/article", articleApi);
router.use("/api/user", userApi);
router.use("/api/blog", blogApi);
// router.use(login());

app.use(
  koa_session({
    store: new Store(),
  })
);

app.use(
  bodyparser({
    enableTypes: ["json", "form"],
  })
);
app.use(koacors());
app.use(auth());
// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
