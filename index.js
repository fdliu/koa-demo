const Koa = require("koa");
const cors = require("koa2-cors");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const path = require('path');
const lowdb = require("./lowdb");
const app = new Koa();
const router = new Router({ prefix: "/api" });
const bodyparser = new BodyParser();
const db = lowdb.install();
app.use(bodyparser);
const log4js = require("log4js")
    //文件下载
var fs = require("fs");
var request = require("request");

log4js.configure({
        appenders: {
            error: {
                type: 'file', //日志类型
                category: 'errLogger', //日志名称
                filename: path.join('logs/', 'error.log'), //日志输出位置，当目录文件或文件夹
                maxLogSize: 104800, // 文件最大存储空间
                backups: 100, //当文件内容超过文件存储空间时，备份文件的数里
            },
            response: {
                type: 'dateFile',
                category: 'resLogger',
                filename: path.join('logs/', 'info.log'), //日志输出模式
                pattern: 'yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLoeSize: 104800,
                backups: 100
            },
            default: {
                type: 'dateFile',
                category: 'resLogger',
                filename: path.join('logs/', 'default.log'), //日志输出模式
                pattern: 'yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLoeSize: 104800,
                backups: 100
            }
        },
        categories: {
            error: { appenders: ['error'], level: 'ERROR' },
            response: { appenders: ['response'], level: 'INFO' },
            default: { appenders: ['default'], level: 'DEBUG' }
        },
        replaceConsole: true
    })
    // log4js.configure({
    //     ppenders: {
    //         cheese: {
    //             type: "file",
    //             filename: "koa.log"
    //         },
    //     },
    //     categories: {
    //         default: {
    //             appenders: ["cheese"],
    //             level: "debug"
    //         }
    //     }
    // });

const logger = log4js.getLogger();
logger.debug("日志")


//创建文件夹目录
var dirPath = path.join(__dirname, "file");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    logger.debug("文件夹创建成功");
} else {
    logger.debug("文件夹已存在");
}


//koa请求跨域问题
app.use(
    cors({
        origin: function(ctx) {
            return ctx.request.headers.origin || ""; //这里是重点，动态获取地址 //*
        },
        credentials: true,
        exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
        allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    })
);

const getInfoList = () => {
    let iData = db.read().get("list").value();
    return iData && iData.length ? iData : [];
};
router.get("/getInfo", async(ctx) => {
    let iData = getInfoList();
    if (iData) {
        ctx.body = {
            code: 209,
            message: "查询成功",
            list: iData,
        };
    } else {
        ctx.body = {
            code: 500,
            message: "查询失败",
            list: [],
        };
    }
});

router.get("/setInfo", async(ctx) => {
    let params = ctx.request.body,
        arr = getInfoList();
    if (params && params.form) { //接口的参数名称form
        //校验
        let { id } = params.form;
        if (arr.filter((item) => item.id === id).length !== 0) {
            ctx.body = {
                code: 403,
                message: "已经存在添加的服务!",
                list: [],
            };
            return;
        }
        arr.push(params.form);
        db.set("list", arr).write();
        ctx.body = {
            code: 200,
            message: "添加并启动成功!",
            list: arr,
        };
    } else {
        ctx.body = {
            code: 509,
            message: "服务器异常!",
            list: [],
        };
    }
});

router.post("/deleteInfo", async(ctx) => {
    let params = ctx.request.body,
        arr = getInfoList();
    if (params && params.ids) {
        //校验
        let ids = `${params.ids}`.split(",");
        let newArr = arr.filter((item) => !ids.includes(String(item.id)));
        db.set("list", newArr).write();
        ctx.body = {
            code: 200,
            message: "删除成功",
            list: newArr,
        };
    } else {
        ctx.body = {
            code: 500,
            message: "服务器异常!",
            list: [],
        };
    }
});
router.get("/startInfo", async(ctx, next) => {
    let body = ctx.request.body;
    if (body && body.form) { //接口的参数名称form
        return new Promise(async(rs, rj) => {
            logger.debug("异步请求前1")
            await next()
            logger.debug("异步请求前2")
        })
    } else {
        ctx.body = {
            code: 509,
            message: "服务器异常!",
            list: [],
        };
    }
});

function downlLoadFile() {
    request({
        timeout: 5000, // 设置超时
        method: 'GET', //请求方式
        url: 'xxx', //url
        qs: { //参数，注意get和post的参数设置不一样  
            xx: "xxx",
            xxx: "xxx",
            xxx: "xxx"
        }

    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);

        } else {
            console.log("error");
        }
    });
}

// 引入路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log("正在监听3000端口号！");
    logger.debug("正在监听3000端口号！")
});