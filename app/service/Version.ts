import { Service } from 'egg';
import type { VersionInterface } from "../types/version"

export default class VersionService extends Service {
    /**
     * 获取版本列表
     * @returns 
     */
    public async index(opt?: {}) {
        const { ctx } = this;
        return await ctx.model.Version.findAll({ ...opt })
    }


    /**
     * 新增版本
     * @param version 版本对象 
     * @returns 
     */
    public async insert(version: VersionInterface) {
        const { ctx } = this;
        return await ctx.model.Version.create({ ...version })
    }
}