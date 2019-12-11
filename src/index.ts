/*
 * @Description:
 * @Author: RONGWEI PENG
 * @Date: 2019-12-10 20:17:17
 * @LastEditors: RONGWEI PENG
 * @LastEditTime: 2019-12-11 21:52:14
 */
import * as Koa from "koa";
import * as bodify from "koa-body";
import * as path from "path";
const chalk = require("chalk");

import { load } from "./utils";

const app = new Koa();

app.use(
  bodify({
    multipart: true,
    strict: false, //配置DELETE
  }),
);

const router = load(path.join(__dirname, "./routes"));

app.use(router.routes());
const port = 8000;
app.listen(port, () => {
  console.log(chalk.green(`启动成功 http://localhost:${port}`));
});
