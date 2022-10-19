
export default class HttpExceptions extends Error {
    code: number;
    msg: string;

    constructor(msg = '接口异常', code = 500) {
        super()
        this.code = code;
        this.msg = msg;
    }
}
