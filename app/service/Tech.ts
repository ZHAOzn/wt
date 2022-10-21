import { Service } from 'egg';
// import AlDate from '../utils/getDate';
export default class TechService extends Service {
    public async index() {
        const { ctx } = this;
        return await ctx.model.Tech.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
        // return await ctx.model.Tech.findAll({ include: [{ model: ctx.model.Dev, as: "dev" }] })
    }
}