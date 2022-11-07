import { Service } from 'egg';
export default class MissionCheckService extends Service {
    public async index() {
        const { ctx, app } = this;
        const { Op } = app.Sequelize
        return await ctx.model.MissionCheck.findOne({ where: { status: { [Op.or]: ['0', '2'] } }, order: [['created_at', 'DESC'], ['id', 'DESC']] });
    }

    public async list() {
        const { ctx } = this;
        return await ctx.model.MissionCheck.findAll();
    }

    public async insert(mission: { url: string, table: string, dev_id: number, key: string, lang: string, status?: number }) {
        const { ctx } = this;
        const { url, table, key, dev_id, status, lang } = mission
        return await ctx.model.MissionCheck.create({ url, table_name: table, key, dev_id, lang, status: status ?? 0 })
    }

    public async update(id: number, nval) {
        const { ctx } = this;
        return await ctx.model.MissionCheck.update({ ...nval }, { where: { id } })
    }
}