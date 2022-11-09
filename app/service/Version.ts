import { Service } from 'egg';
import type { VersionInterface, VersionUpdateInterface } from "../types/version"

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
     * 获取一个版本信息
     * @param opt 
     * @returns 
     */
    public async detail(opt?: {}) {
        const { ctx } = this;
        return await ctx.model.Version.findOne({ ...opt })
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

    /**
     * 更新版本信息
     * @param data 数据
     * @param id 版本id
     * @returns 更新条目数
     */
    public async update(data: VersionUpdateInterface, id: number) {
        const { ctx } = this;
        const res = await ctx.model.Version.update({ ...data }, { where: { id } })
        if (res[0] === 1)
            return await this.detail({ where: { id } })
        else {
            ctx.body = { code: 405, msg: "更新失败" }
        }
    }
}