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

    /**更新版本 */
    public async update() {
        const { ctx } = this;
        const { id, name, version_code, year, num, update_time, live_time, test_num } = ctx.request.body;
        ctx.validate({ id: 'int', name: 'string?', version_code: 'string?', year: 'string?', num: 'int?', update_time: 'datetime?', live_time: 'datetime?', test_num: 'int?' })
        const res = await ctx.service.version.update({ name, version_code, year, num, update_time, live_time, test_num }, id)
        ctx.body = res ? { code: 200, msg: "更新成功", data: res } : { code: 404, msg: "更新服务无返回结果", data: res }
    }
}