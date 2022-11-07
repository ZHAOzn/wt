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
        const dev = await ctx.service.dev.getDev(mission.dev_id);
        // console.log(mission);
        const devInfoId = mission.lang === 'zh' ? dev?.zh.id : dev?.en.id


        if (mission && mission.id) {
            const detail = await ctx.service.dev.checkDevDetail(mission.url)
            try {
                if (detail && detail.arr.length > 2) {
                    const tech = await ctx.service.dev.getTech(detail.tech)

                    await ctx.service.dev.update(mission.dev_id, { tech: tech ? tech.id : null })
                    if (devInfoId)
                        await ctx.service.dev.updateInfo(devInfoId, mission.lang, { info: detail.str })

                    await ctx.service.missionCheck.update(mission.id, { status: 1 })
                } else {
                    await ctx.service.missionCheck.update(mission.id, { status: 1 })
                }
            } catch (error) {
                await ctx.service.missionCheck.update(mission.id, { status: mission.status === 2 ? mission.status + 1 : 2 })
            }



        }

    }
}