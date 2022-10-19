import { Context } from 'egg';
import HttpExceptions from "../exceptions/http_exceptions";

// options: EggAppConfig['verifyToken']
// 这里是你自定义的中间件
interface error {
    code: number;
    msg: string;
    errsInfo?:string;
}
export default function errorHandlerMiddleware(): any {
    return async (ctx: Context, next: () => Promise<any>) => {
        try {
            await next();
        } catch (err) {   
            // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
            ctx.app.emit('error', err, ctx);

            let status = (err as any).status || 500;
            let error: error = { code: NaN, msg: ""};

            if (err instanceof HttpExceptions) {   
                error.msg = err.msg;
                error.code = err.code;
            } else {
                // 未知异常，系统异常，线上不显示堆栈信息
                // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
                error.errsInfo = status === 500 && ctx.app.config.env === 'prod'
                    ? 'Internal Server Error'
                    : (err as any).message;
                error.code = status;
                error.msg = "服务器错误"
            }

            // 从 error 对象上读出各个属性，设置到响应中
            ctx.body = error;
            if (status === 422) {
                ctx.body.detail = (err as any).errors;
            }
            // ctx.status = status;
        }

    };

}   