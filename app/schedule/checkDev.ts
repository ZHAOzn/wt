
const Subscription = require('egg').Subscription;

export default class checkDev extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // interval: '1m', // 15 分钟间隔
            cron: '0 0/12 0,1,2,3,4,16,17,18,19,20,21,22,23 * * *',
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