const Subscription = require('egg').Subscription;
export default class checkDev extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // interval: '1m', // 15 分钟间隔
            cron: '0 0/30 6,8,12 * * *',
            type: 'worker', // 指定随机一个 worker 执行
        };
    }

    async subscribe() {
        const { ctx } = this;
        const mission = await ctx.service.missionCheck.index();
        // console.log(mission);
        if (mission && mission.id) {
            const detail = await ctx.service.dev.checkDevDetail(mission.url)
            if (detail) {
                const tech = await ctx.service.dev.getTech(detail.tech)
                await ctx.service.dev.update(mission.dev_id, { type: detail.type, tech: tech ? tech.id : null })
                await ctx.service.missionCheck.update(mission.id, { status: 1 })
            } else {
                await ctx.service.missionCheck.update(mission.id, { status: 1 })
            }


        }

    }
}