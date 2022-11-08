import { Controller } from 'egg';
// import type { VersionInterface } from "../types/version"

export default class VersionClass extends Controller {
    /**版本列表 */
    public async index() {
        const { ctx } = this;
        ctx.body = await ctx.service.version.index()
    }

    /**新增版本 */
    public async insert() {
        const { ctx } = this;
        const { name, version_code, year, num, update_time, live_time, test_num } = ctx.request.body;
        ctx.validate({ name: 'string?', version_code: 'string?', year: 'string', num: 'int', update_time: 'datetime?', live_time: 'datetime?', test_num: 'int?' })
        ctx.body = await ctx.service.version.insert({ name, version_code, year, num, update_time, live_time, test_num })
    }
}