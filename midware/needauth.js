const Store = require("../utils/store");
const redis = new Store();

const needAuthUrl = ["/api/article/publish", "/api/article/stash"];

module.exports = () => {
  return async (ctx, next) => {
    const { url, method } = ctx.request;

    // 白名单
    if (method !== "DELETE" && !needAuthUrl.includes(url)) {
      return await next();
    }

    const SESSIONID = ctx.cookies.get("koa:sess");
    console.log(`${new Date()} SESSIONID`, SESSIONID);

    if (!SESSIONID) {
      return (
        (ctx.status = 401),
        (ctx.body = {
          status: -1,
          msg: "没有携带SESSIONID，请前往登录",
        })
      );
    }
    const redisData = await redis.get(SESSIONID);

    if (!redisData) {
      return (
        (ctx.status = 401),
        (ctx.body = {
          status: -1,
          msg: "SESSIONID已经过期~，请前往登录",
        })
      );
    }

    if (redisData && redisData.SESSIONID) {
      console.log(`中间件-登录了，id为：${redisData.SESSIONID}`);
      await next();
    }
  };
};
