/*
 * @Description:
 * @Author: RONGWEI PENG
 * @Date: 2019-12-10 23:09:16
 * @LastEditors: RONGWEI PENG
 * @LastEditTime: 2019-12-11 23:26:51
 */
const chalk = require("chalk");
import { Context } from "koa";
import { get, post, querystring, body } from "../utils/index";

const users = [{ name: "张三丰", age: 100 }];

export default class Users {
  @get("/users")
  @querystring({
    age: { type: "int", required: false, max: 200, convertType: "int" }, //校验age字段必填
  })
  public async list(ctx: Context) {
    ctx.body = { ok: 1, data: users };
  }

  
  @post('/users', {
    middlewares: [
      //这里没有进来判断,未找到原因
        async function validation(ctx: Context, next: () => Promise<any>) {
            // 用户名必填
            const name = ctx.request.body.name
            console.log( 999,ctx.request.body.name)
            if (!name) {
                throw "请输入用户名";
            }
            // 用户名不能重复
            try {
                // await api.findByName(name);
                // 校验通过
                await next();
            } catch (error) {
                throw error;
            }
        }
    ]
})
  public add(ctx: Context) {
    console.log(ctx);
    ctx.body = { ok: 1, data: users };
  }
}
