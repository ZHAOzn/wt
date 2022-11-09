
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
        const {ctx} = this;
        await ctx.service.dev.handleDevData('zh')
        await ctx.service.dev.handleDevData('en')
    }

}