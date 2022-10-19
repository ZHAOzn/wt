import { Service } from 'egg';
export default class DevService extends Service {
    public async index(opt?: {}) {
        const { ctx } = this
        return await ctx.model.Dev.findAll({
            ...opt, include: [
                { model: ctx.model.DevEn, as: "en" },
                { model: ctx.model.DevZh, as: "zh" }
            ]
        })
    }

    public async getDev(id: number) {
        const { app, ctx } = this
        return await app.model.Dev.findByPk(id, {
            include: [
                { model: ctx.model.DevEn, as: "en" },
                { model: ctx.model.DevZh, as: "zh" }
            ],
        })
    }

    public async insert(data: any) {
        const { ctx } = this
        return await ctx.model.Dev.create({ ...data })
    }

    public async update(id: number, data: any) {
        const { ctx } = this;
        // await ctx.model.Dev.update({ ...data }, { where: { id: id } })
        await ctx.model.Dev.sequelize?.query(`UPDATE dev set type = concat(IFNULL(type,''),'${data.type}') WHERE id=${id}`)
        // return {results,metadata}
    }

    public async insertInfo(lang: string, data: any) {
        const { ctx } = this;
        if (lang === 'zh')
            await ctx.model.DevZh.create({ ...data })

        if (lang === 'en')
            await ctx.model.DevEn.create({ ...data })
    }

    /**
     * 向wt官网请求新的dev
     * @param lang 语言，判断请求中文链接还是英文链接?'zh':'en'
     * @param type 检索类型，'自动','手动'
     * @param num 检索数据数量
     * @returns dev数据，{官网新闻链接、图片、标题、简介、标注的发布时间}
     */
    public async checkDev(lang = 'zh', type = '自动', num = 1) {
        const { ctx } = this;
        const axios = require('axios');
        const cheerio = require('cheerio');
        const url = lang === 'zh' ? 'https://warthunder.com/zh/news/?tags=%E5%BC%80%E5%8F%91' : 'https://warthunder.com/en/news/?tags=Development'

        const req = await axios.get(url).then(res => {
            ctx.service.recordCheck.insert(res.status, res.statusText, type, url)
            return { status: true, data: res.data };
        }).catch(err => {
            ctx.service.recordCheck.insert(err.response ? err.response.status : 404, err.response ? err.response.data : err.message, type, url)
            return { status: false, data: err }
        })

        if (req.status) {
            const $ = cheerio.load(req.data)
            const devs: { link: string, img: string, name: string, intro: string, date: Date }[] = []

            for (let i = 0; i < num; i++) {
                // const element = array[index];
                const el = $('body .content .section .showcase .showcase__content-wrapper .showcase__item').eq(i)
                const link = `https://warthunder.com${el.find('.widget__link').attr('href')}`
                const img = `https:${el.find('.widget__poster .widget__poster-media').attr('data-src')}`
                const name = el.find('.widget__content .widget__title').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
                const intro = el.find('.widget__content .widget__comment').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
                const date = el.find('.widget__content .widget__meta .widget-meta__item--right').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
                devs.push({ link, img, name, intro, date: await this.ctx.service.utils.getDate(date) })
            }


            // const link = `https://warthunder.com${$('body .content .section .showcase .showcase__content-wrapper .showcase__item .widget__link').attr('href')}`
            // const img = `https:${$('body .content .section .showcase .showcase__content-wrapper .showcase__item .widget__poster .widget__poster-media').attr('data-src')}`
            // const name = `${$('body .content .section .showcase .showcase__content-wrapper .showcase__item .widget__content .widget__title').html()}`.replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
            // const intro = `${$('body .content .section .showcase .showcase__content-wrapper .showcase__item .widget__content .widget__comment').html()}`.replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
            // const date = `${$('body .content .section .showcase .showcase__content-wrapper .showcase__item .widget__content .widget__meta .widget-meta__item--right').html()}`.replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")

            // const latestDev = { link, img, name, intro, date: await this.ctx.service.utils.getDate(date) }
            // console.log(latestDev);

            // return latestDev;

            // return $('body .content .section .showcase .showcase__content-wrapper .showcase__item').eq(1).find('.widget__link').attr('href')
            return devs

        }
    }

    public async checkDevDetail(url, type = '自动') {
        const { ctx } = this;
        const axios = require('axios');
        const cheerio = require('cheerio');

        const req = await axios.get(url).then(res => {
            ctx.service.recordCheck.insert(res.status, res.statusText, type, url)
            return { status: true, data: res.data };
        }).catch(err => {
            ctx.service.recordCheck.insert(err.response ? err.response.status : 404, err.response ? err.response.data : err.message, type, url)
            return { status: false, data: err }
        })

        if (req.status) {
            const $ = cheerio.load(req.data)
            // console.log($('body .content .section.article').children('.g-grid').eq(1).children('.g-col'));
            // console.log($('body .content .section.article').children('.g-grid').eq(1).children('.g-col').eq(0).children('h3').eq(0).html());

            const str = $('body .content .section.article').children('.g-grid').eq(1).children('.g-col').eq(0).children('h3').eq(0).html()
            if (str) {
                const arr = str.replace(/，|, /g, ',').split(',')

                const tech = arr[2]
                const type = arr[1]

                return { tech, type, str, arr }
            } else return false




        }
    }

    public async isExist(array, data) {
        if (data.img) {
            const key = array.findIndex(val => val?.zh?.img === data.img || val?.en?.img === data.img)
            if (key !== -1) {
                const res: string[] = []
                if (array[key]?.zh?.img === data.img) res.push('zh')
                if (array[key]?.en?.img === data.img) res.push('en')
                return { id: array[key].id, data: res }
            } else {
                return { id: null, data: [] };
            }
        } else return false

    }


    public async getTimeSlot(date: Date, time: number) {
        const latest = new Date(date.getTime() - time)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} —— ${latest.getHours()}:${latest.getMinutes()}:${latest.getSeconds()}`;
    }

    // public async getType(intro: string) {
    //     // console.log(intro);

    //     const types = [['主站坦克', '自行防空炮', '中型坦克', '轻型坦克', '重型坦克', '坦克歼击车', '自行火炮','反坦克导弹运载车','自行榴弹炮', 'MBT', 'SPAAG', 'ground vehicles']]

    //     console.log(types);

    //     return intro
    // }

}