
const Subscription = require('egg').Subscription;

export default class checkDev extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // interval: '1m', // 15 分钟间隔
            cron: '0 0/21 5,6,7,8,9,10,11 * * *',
            type: 'worker', // 指定随机一个 worker 执行
        };
    }


    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const getData = async (lang: string) => {
            const { ctx } = this;
            const foreignData = await ctx.service.dev.checkDev(lang, '自动', 3);
            const localData = await ctx.service.dev.index({ limit: 10, order: [['en', 'time', 'DESC'], ['zh', 'time', 'DESC'], ['created_at', 'DESC']] })

            if (foreignData.length > 0)
                for (const iterator of foreignData) {
                    const isExist = await ctx.service.dev.isExist(localData, iterator)
                    // isExists.push(isExist)

                    if (isExist) {
                        //如果数据库里没有
                        if (!isExist.id) {

                            //dev表插入数据
                            const res = await ctx.service.dev.insert({ version_id: 3, ...iterator, is_before_dev: 0 });
                            //dev详情表插入数据
                            await ctx.service.dev.insertInfo(lang, { dev_id: res.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: await ctx.service.dev.getTimeSlot(new Date(), 21 * 60000) })
                            ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: res.id, key: 'type,tech' })
                        }
                        //如果数据库里有 
                        else {
                            const key = isExist.data.findIndex(val => val === lang)
                            //如果数据库里没有详情
                            if (key === -1) {
                                await ctx.service.dev.insertInfo(lang, { dev_id: isExist.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: await ctx.service.dev.getTimeSlot(new Date(), 21 * 60000) })
                                ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: isExist.id, key: 'type,tech' })
                            }
                        }


                        // const detail = await ctx.service.dev.checkDevDetail(foreignData.link)
                        // if (detail) {
                        //     await ctx.service.dev.update(isExist.id, { type: detail.type })
                        // }




                    }


                }

        }
        await getData('zh');
        await getData('en');
    }

}