import { Controller } from 'egg';

export default class DevController extends Controller {
    public async index() {
        const { ctx } = this;
        ctx.body = await ctx.service.tech.index()
    }

    public async getTech() {
        const { ctx } = this;
        const { tech } = ctx.query;
        ctx.body = await ctx.service.dev.getTech(tech)
    }
}