
const Subscription = require('egg').Subscription;

export default class checkDev extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // interval: '10m', // 15 分钟间隔
            cron: '0 0/15 0,1,2,3,16,17,18,19,20,21,22,23 * * *',
            type: 'worker', // 指定随机一个 worker 执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        // const { ctx } = this
        const getData = async (lang: string) => {
            const { ctx } = this;
            // console.log(await ctx.service.dev.getTimeSlot(new Date(), 15 * 60000));
            const foreignData = await ctx.service.dev.checkDev(lang);
            const localData = await ctx.service.dev.index({ limit: 5, order: [['created_at', 'DESC']] })
            const isExist = await ctx.service.dev.isExist(localData, foreignData)

            if (isExist) {
                //如果数据库里没有
                if (!isExist.id) {
                    const detail = await ctx.service.dev.checkDevDetail(foreignData.link)
                    //dev表插入数据
                    const res = await ctx.service.dev.insert({ version_id: 3, ...foreignData, type: detail.type });
                    //dev详情表插入数据
                    await ctx.service.dev.insertInfo(lang, { dev_id: res.id, ...foreignData, time: foreignData.date, recording_time: new Date(), lang, real_time_slot: await ctx.service.dev.getTimeSlot(new Date(), 15 * 60000) })

                }
                //如果数据库里有 
                else {
                    const key = isExist.data.findIndex(val => val === lang)
                    //如果数据库里没有详情
                    if (key === -1) {
                        await ctx.service.dev.insertInfo(lang, { dev_id: isExist.id, ...foreignData, time: foreignData.date, recording_time: new Date(), lang, real_time_slot: await ctx.service.dev.getTimeSlot(new Date(), 15 * 60000) })
                    }
                }




            }
        }
        await getData('zh');
        await getData('en');


        // if(isExist.findIndex(val=>val==='zh') === -1)
        //     await.

        // const res = await this.ctx.curl('http://www.api.com/cache', {
        //     dataType: 'json',
        // });
        // this.ctx.app.cache = res.data;
    }

}