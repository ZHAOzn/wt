import { Service } from 'egg';

export default class RecordCheckService extends Service {
    public async index(option?: any) {
        const { ctx } = this;
        return await ctx.model.RecordCheck.findAll({ ...option })
    }

    public async insert(code: number, msg: string, type: string, url: string) {
        const { ctx } = this;
        return await ctx.model.RecordCheck.create({ code, msg, type, url })
    }
}