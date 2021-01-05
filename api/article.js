const Router = require("koa-router");
const router = new Router();

const { isEmpty } = require("../utils/utils");
const { query, selectAll, selectAllById } = require("../utils/db");

// 查询文章
router.get("/", async (ctx) => {
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
      const result = await selectAll("article");
      ctx.body = {
        status: 200,
        msg: "查询成功",
        result: result || [],
      };
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "查询失败",
    };
  }
});

// 发布
router.post("/publish", async (ctx) => {
  console.log(`${new Date()} 发布`, ctx.request.body);

  try {
    const { id, title, content, tags, createTime, coverUrl } = ctx.request.body;
    let strTags = JSON.stringify(tags)
    if (
      isEmpty(title) ||
      isEmpty(content) ||
      isEmpty(tags) ||
      isEmpty(createTime) ||
      isEmpty(createTime)
    ) {
      ctx.body = {
        status: -1,
        msg: "必填项不能为空",
      };
      return false;
    }

    if (id) {
      await query(
        `UPDATE article SET title='${title}',content=${JSON.stringify(
          content
        )},tags='${strTags}',createTime='${createTime}',coverUrl='${coverUrl}',type='PUBLISH' WHERE id=${Number(
          id
        )}`
      );
    } else {
      await query(
        "INSERT INTO article(title, content, tags, createTime, coverUrl, type) VALUES(?,?,?,?,?,?)",
        [title, content, strTags, createTime, coverUrl, "PUBLISH"]
      );
    }
    ctx.body = {
      status: 200,
      msg: "发布成功",
    };
  } catch (error) {
    console.log(`${new Date()} 发布失败`, JSON.stringify(error));
    ctx.body = {
      status: -1,
      msg: "发布失败",
    };
  }
});

// 暂存
router.post("/stash", async (ctx) => {
  console.log(`${new Date()} 暂存`, ctx.request.body);
  try {
    const { id, title, content, tags, createTime, coverUrl } = ctx.request.body;
    let strTags = JSON.stringify(tags)
    if (id) {
      await query(
        `UPDATE article SET title='${title}',content=${JSON.stringify(
          content
        )},tags='${strTags}',createTime='${createTime}',coverUrl='${coverUrl}',type='STASH' WHERE id=${Number(
          id
        )}`
      );
    } else {
      await query(
        "INSERT INTO article(title, content, tags, createTime, coverUrl, type) VALUES(?,?,?,?,?,?)",
        [title, content, strTags, createTime, coverUrl, "STASH"]
      );
    }
    ctx.body = {
      status: 200,
      msg: "暂存成功",
    };
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "暂存失败",
    };
  }
});

// 更新文章
router.put("/", async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    msg: "更新文章",
  };
});

// 删除文章
router.delete("/", async (ctx) => {
  const { id } = ctx.request.body;
  console.log(`${new Date()} 删除文章`, ctx.request.body);
  if (id) {
    await query(`DELETE FROM article WHERE id=${id}`);
    ctx.body = {
      status: 200,
      msg: "删除成功",
    };
  } else {
    ctx.body = {
      status: -1,
      msg: "删除失败，id不正确",
    };
  }
});

// 查询标签
router.get("/tags", async (ctx) => {
  try {
    const result = await selectAll("tags");
    ctx.body = {
      status: 200,
      msg: "查询成功",
      result,
    };
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: "查询失败",
    };
  }
});

// 添加标签
router.post("/tags", async (ctx) => {
  try {
    const { text } = ctx.request.body;
    const result = await query(`SELECT * FROM tags WHERE text='${text}'`);
    console.log(`${new Date()} text`, result);
    if (!isEmpty(result)) {
      ctx.body = {
        status: -1,
        msg: "改标签已存在，不能重复",
      };
    } else {
      await query("INSERT INTO tags(text) VALUES(?)", [text]);
      ctx.body = {
        status: 200,
        result: ctx.request.body,
        msg: "新增成功",
      };
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      msg: JSON.stringify(error),
    };
  }
});

module.exports = router.routes();
