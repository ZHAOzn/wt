import { Controller } from 'egg';

export default class DevController extends Controller {
    public async index() {
        const { ctx } = this;
        const { limit } = ctx.query
        const opt: { limit?: number } = {}
        if (limit) opt.limit = Number(limit)

        ctx.body = await ctx.service.dev.index(opt)
    }

    public async checkDev() {
        const { ctx } = this;
        const { lang } = ctx.query
        ctx.body = await ctx.service.dev.checkDev(lang, '手动');
    }

    public async checkDevDetail() {
        const { ctx } = this;
        const { url } = ctx.query
        ctx.body = await ctx.service.dev.checkDevDetail(url, `手动`)
    }

    public async detail() {
        const { ctx } = this;
        const { id } = ctx.params;
        ctx.body = await ctx.service.dev.getDev(id)
    }

    public async insert() {
        const { ctx } = this;
        const data = await ctx.service.dev.checkDev();
        const res = await ctx.service.dev.insert({ version_id: 3, ...data });
        ctx.body = { code: 200, data: res }
    }

    public async checkOldDevs() {
        const { ctx } = this;
        const { lang, num, page } = ctx.query;
        // const list = []
        // for (let i = 0; i < 66; i++) {
        //     const res = await ctx.service.dev.checkDev(lang, '手动', 18, i++)
        //     if (Array.isArray(res)) {
        //         Array.prototype.push.apply(list, res);
        //     }
        // }

        if (page) {
            const localData = await ctx.service.dev.index();
            const foreignData = await ctx.service.dev.checkDev(lang, '手动', Number(num), Number(page))

            if (!foreignData || foreignData.length <= 0) {
                ctx.body = { code: 404, msg: '获取远程数据失败' }
                return;
            }

            for (const iterator of foreignData) {
                const isExist: any = await ctx.service.dev.isExist(localData, iterator)

                //如果数据库里没有
                if (!isExist.id) {
                    //dev表插入数据
                    const res: any = await ctx.service.dev.insert({ version_id: 3, ...iterator, is_before_dev: 0 });
                    //dev详情表插入数据
                    await ctx.service.dev.insertInfo(lang, { dev_id: res.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: null })
                    ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: res.id, key: 'type,tech' })
                }
                //如果数据库里有 
                else {
                    const key = isExist.data.findIndex(val => val === lang)
                    //如果数据库里没有详情
                    if (key === -1) {
                        await ctx.service.dev.insertInfo(lang, { dev_id: isExist.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: null })
                        ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: isExist.id, key: 'type,tech' })
                    }
                }

            }
        }
        else {
            for (let i = 18; i >= 1; i--) {
                const foreignData = await ctx.service.dev.checkDev(lang, '手动', 18, i)
                const localData = await ctx.service.dev.index();
                if (!foreignData || foreignData.length <= 0) {
                    continue;
                    // ctx.body = { code: 404, msg: '获取远程数据失败' }
                    // return;
                }
                for (const iterator of foreignData) {
                    const isExist: any = await ctx.service.dev.isExist(localData, iterator)

                    //如果数据库里没有
                    if (!isExist.id) {
                        //dev表插入数据
                        const res: any = await ctx.service.dev.insert({ version_id: 4, ...iterator, is_before_dev: 0 });
                        //dev详情表插入数据
                        await ctx.service.dev.insertInfo(lang, { dev_id: res.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: null })
                        ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: res.id, key: 'type,tech' })
                    }
                    //如果数据库里有 
                    else {
                        const key = isExist.data.findIndex(val => val === lang)
                        //如果数据库里没有详情
                        if (key === -1) {
                            await ctx.service.dev.insertInfo(lang, { dev_id: isExist.id, ...iterator, time: iterator.date, recording_time: new Date(), lang, real_time_slot: null })
                            ctx.service.missionCheck.insert({ url: iterator.link, table: 'Dev', dev_id: isExist.id, key: 'type,tech' })
                        }
                    }

                }

            }

        }

        ctx.body = {}
    }

}
