/*
 * @Description:
 * @Author: RONGWEI PENG
 * @Date: 2019-12-11 21:03:10
 * @LastEditors: RONGWEI PENG
 * @LastEditTime: 2019-12-11 23:24:21
 */

import * as KoaRouter from "koa-router";
import * as Koa from "koa";
import * as glob from "glob";
import * as Parameter from "parameter";

const chalk = require("chalk");

const router = new KoaRouter();

type HTTPMethod = "GET" | "POST";



const decorator = (method: HTTPMethod, path, options: routeOptions = {}, router: KoaRouter) => {
    return (target, property, descriptor) => {
     
      process.nextTick(() => {
        //集合中间件数组
        const middlewares = [];
  
        //类装饰器中间件插入
        if (target.middlewares) {
          middlewares.push(...target.middlewares);
        }
  
        //其他方法装饰器插入拦截执行中间件
        if (target[property].middlewares) {
          middlewares.push(...target[property].middlewares);
        }
  
        middlewares.push(target[property]);
  
        //执行中间件队列
        const url = options.prefix ? options.prefix + path : path;
        const meth = method.toLocaleLowerCase();
        router[meth](url, ...middlewares);
      });
    };
  };
  
const method = (method: HTTPMethod) => (path: string, options?: routeOptions) =>
{
  console.log(13579,method,path,options)
 return  decorator(method, path, options, router);
}

interface routeOptions {
  prefix?: string; //前缀
  middlewares?: Array<Koa.middleware>; //中间件数组
}
interface loadOptions {
  extname?: string; //要匹配的后缀
}
const load = (path: string, options: loadOptions = {}) => {
  const extname = options.extname ? options.extname : ".{js,ts}";
  glob.sync(require("path").join(path, `./**/*${extname}`)).forEach(element => require(element));
  return router;
};

//中间件
const middlewares = (middlewares: Koa.middleware[]) => {
  return target => {
    target.prototype.middlewares = middlewares;
  };
};

/**
 * @Description: 校验规则
 */
const validateRule = paramPart => rule => {
 
  return function(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function() {
      const ctx = arguments[0];
      const p = new Parameter();
      const data = ctx[paramPart];
      console.log(666,ctx.params,paramPart,data)
      const errors = p.validate(rule, data);
      if (errors) {

        console.log(errors)
        // throw new Error(JSON.stringify(errors));
      }
      return oldValue.apply(null, arguments);
    };
    return descriptor;
  };
};

const querystring = validateRule("query");
const body = validateRule("body");

const get = method("GET");
const post = method("POST");
export { load, middlewares, get, post, querystring ,body};
