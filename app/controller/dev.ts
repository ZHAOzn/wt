import { Controller } from 'egg';

export default class DevController extends Controller {
    public async index() {
        const { ctx } = this;
        const { limit } = ctx.query
        const opt: { limit?: number } = {}
        if (limit) opt.limit = Number(limit)

        ctx.body = await ctx.service.dev.index(opt)
    }

    public async checkDev() {
        const { ctx } = this;
        const { lang } = ctx.query
        ctx.body = await ctx.service.dev.checkDev(lang, '手动');
    }

    public async checkDevDetail() {
        const { ctx } = this;
        const { url } = ctx.query
        ctx.body = await ctx.service.dev.checkDevDetail(url, `手动`)
    }

    public async detail() {
        const { ctx } = this;
        const { id } = ctx.params;
        ctx.body = await ctx.service.dev.getDev(id)
    }

    public async insert() {
        const { ctx } = this;
        const data = await ctx.service.dev.checkDev();
        const res = await ctx.service.dev.insert({ version_id: 3, ...data });
        ctx.body = { code: 200, data: res }
    }
}
