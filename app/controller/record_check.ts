import { Controller } from 'egg';
export default class RecordCheckController extends Controller {
    public async index() {
        const { ctx } = this;
        const query = ctx.query;
        ctx.body = await ctx.service.recordCheck.index({ limit: query.limit ? Number(query.limit) : undefined, order: [['id', 'DESC']] })
    }
}