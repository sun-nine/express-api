import express from "express";
import cors from "cors";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

const port = 3002;

app.use(cors());
app.use(express.json());

app.get("/ogp", async (req, res) => {
  const { url } = req.query;

  await fetch(url as string)
    // URLからtext/htmlデータを取得 ====================================
    .then((res) => res.text())
    .then((text) => {
      const metaData = {
        url: url as string,
        title: "",
        description: "",
        image: "",
      };
      // 取得したtext/htmlデータから該当するmetaタグを取得 ==============
      const doms = new JSDOM(text);
      const metas = doms.window.document.getElementsByTagName("meta");

      // title, description, imageにあたる情報を取り出し配列として格納 ==
      for (let i = 0; i < metas.length; i++) {
        console.log(" i: ", i);
        console.log(" metas[i]", metas[i]);
        console.log("name", metas[i].getAttribute("name"));
        console.log("property", metas[i].getAttribute("property"));

        let pro = metas[i].getAttribute("name");
        if (typeof pro == "string") {
          if (pro.match("title") && metaData.title === "")
            metaData.title = metas[i].getAttribute("content");
          if (pro.match("description") && metaData.description === "")
            metaData.description = metas[i].getAttribute("content");
          if (pro.match("image") && metaData.image === "")
            metaData.image = metas[i].getAttribute("content");
        }

        pro = metas[i].getAttribute("property");
        if (typeof pro == "string") {
          if (pro.match("title") && metaData.title === "")
            metaData.title = metas[i].getAttribute("content");
          if (pro.match("description") && metaData.description === "")
            metaData.description = metas[i].getAttribute("content");
          if (pro.match("image") && metaData.image === "")
            metaData.image = metas[i].getAttribute("content");
        }
      }
      console.log(metaData);
      return res.status(200).json(metaData);
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).json({ message: e });
    });
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
