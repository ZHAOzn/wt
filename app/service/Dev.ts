import { Service } from 'egg';
// import AlDate from '../utils/getDate';
export default class DevService extends Service {
    public async index(opt?: {}) {
        const { ctx } = this
        return await ctx.model.Dev.findAll({
            ...opt, include: [
                { model: ctx.model.DevEn, as: "en" },
                { model: ctx.model.DevZh, as: "zh" },
                { model: ctx.model.Tech, as: 'tech' }
            ],
            order: [['en', 'time', 'DESC'], ['zh', 'time', 'DESC'], ['created_at', 'DESC']]
        })
    }

    public async getDev(id: number) {
        const { app, ctx } = this
        return await app.model.Dev.findByPk(id, {
            include: [
                { model: ctx.model.DevEn, as: "en" },
                { model: ctx.model.DevZh, as: "zh" },
                { model: ctx.model.Tech, as: 'tech' }
            ]
        })
    }

    public async insert(data: any) {
        const { ctx } = this
        return await ctx.model.Dev.create({ ...data })
    }

    /**
     * 更新dev表type
     * @param id 目标id
     * @param data 更新的数据
     */
    public async update(id: number, data: any) {
        const { ctx } = this;
        // await ctx.model.Dev.update({ ...data }, { where: { id: id } })
        return await ctx.model.Dev.sequelize?.query(`UPDATE dev set tech_id = '${data.tech}' WHERE id=${id}`)
        // return await ctx.model.Dev.sequelize?.query(`UPDATE dev set type = concat(IFNULL(type,''),'${data.type}') , tech_id = '${data.tech}' WHERE id=${id}`)
        // return {results,metadata}
    }

    /**
     * 更新dev info 表
     * @param id 目标id
     * @param lang 目标语言
     * @param data 更新的数据
     * @returns 更新结果
     */
    public async updateInfo(id: number, lang: string, data: any) {
        const { ctx } = this;
        return lang === 'zh' ? await ctx.model.DevZh.update(data, { where: { id } }) : await ctx.model.DevEn.update(data, { where: { id } })
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
    public async checkDev(lang = 'zh', type = '自动', num = 1, page = 1) {
        const { ctx } = this;
        const axios = require('axios');
        const cheerio = require('cheerio');
        const url = lang === 'zh' ? `https://warthunder.com/zh/news/${page > 1 ? 'page/' + page + '/' : ''}?tags=%E5%BC%80%E5%8F%91` : `https://warthunder.com/en/news/${page > 1 ? 'page/' + page + '/' : ''}?tags=Development`

        const req = await axios.get(url).then(res => {
            ctx.service.recordCheck.insert(res.status, res.statusText, type, url)
            return { status: true, data: res.data };
        }).catch(err => {
            ctx.service.recordCheck.insert(err.response ? err.response.status : 404, err.response ? err.response.data : err.message, type, url)
            return { status: false, data: err }
        })

        if (req.status) {
            const $ = cheerio.load(req.data)
            const devsLength: number = $('body .content .section .showcase .showcase__content-wrapper .showcase__item').length
            const nums = num === 0 ? devsLength : num > devsLength ? devsLength : num

            const devs: { link: string, img: string, name: string, intro: string, date: Date }[] = []

            for (let i = 0; i < nums; i++) {
                // const element = array[index];
                const el = $('body .content .section .showcase .showcase__content-wrapper .showcase__item').eq(i)
                const link = `https://warthunder.com${el.find('.widget__link').attr('href')}`
                const name = el.find('.widget__content .widget__title').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
                const img = el.find('.widget__poster .widget__poster-media').attr('data-src') ? `https:${el.find('.widget__poster .widget__poster-media').attr('data-src')}` : `undefined::${name}`;
                const intro = el.find('.widget__content .widget__comment').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")
                const date = el.find('.widget__content .widget__meta .widget-meta__item--right').html().replace(/\r|\n/ig, "").replace(/^\s*|\s*$/g, "")

                devs.push({ link, img, name, intro, date: await this.ctx.service.utils.getDate(date ? date : '1 一月 1000') })
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

    /**
     * 向wit官网请求dev详情
     * @param url 目标地址
     * @param type 检索类型
     * @returns 详情数据{科技树,类型,html字符串}
     */
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
                const arr = str.replace(/，|、|、 |， |, |,/g, ',').split(',')

                if (arr.length > 3) {
                    const tech = [arr[1], arr[2], arr[3]]
                    const type = arr[1]
                    return { tech, type, str, arr }
                }
                else return false


            } else return false




        }
    }

    public async isExist(array, data) {
        /**返回true为存在 */
        const rule_1 = (img_1: string, img_2: string) => {

            if (!img_1 || !img_2) return false;

            //获取两个img的文件名，并根据符号'_'转化为数组
            const img_1_name = img_1.split('/')[img_1.split('/').length - 1].split('_')
            const img_2_name = img_2.split('/')[img_2.split('/').length - 1].split('_')

            //如果两个转化数组失败，则返回false
            if (!(Array.isArray(img_1_name) && Array.isArray(img_2_name))) return false;
            //如果两个数组长度差大于2，返回false，判定为不是同一个dev
            if (img_1_name.length - img_2_name.length > 2 || img_1_name.length - img_2_name.length < -2) return false;

            //获取两个数组中最短的长度，并截取两个数组的该长度数值
            const length = img_1_name.length - img_2_name.length >= 0 ? img_1_name.length : img_2_name.length
            img_1_name.length = img_2_name.length = length

            //获取两个数组中，相等的数值个数
            let num = 0;
            for (let i = 0; i < length; i++) {
                const img_1_is_lang = ['eng', 'en', 'zh', 'cn'].findIndex(val => val === img_1_name[i]) !== -1
                const img_2_is_lang = ['eng', 'en', 'zh', 'cn'].findIndex(val => val === img_2_name[i]) !== -1
                if ((img_1_name[i] !== img_2_name[i]) && !(img_1_is_lang && img_2_is_lang)) continue;
                num++;
            }

            //当两个数组中，相等的比例大于70%时，判定为相等，返回true;
            if (num / length > 0.7) return true;
            else return false;


        }

        if (data.img) {
            // const key = array.findIndex(val => val?.zh?.img === data.img || val?.en?.img === data.img)

            const key = array.findIndex(val => {
                return val?.zh?.img === data.img || val?.en?.img === data.img || rule_1(val?.zh?.img, data.img) || rule_1(val?.en?.img, data.img)
            })

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


    /**
     * 获取时间段
     * @param date 入库时间
     * @param time 时间差ms
     * @returns 时间段String，例:"21:00:01 —— 21:15:01"
     */
    public async getTimeSlot(date: Date, time: number) {
        const { app } = this;
        const leftDate = await app.utils.getDate(date.getTime() - time)
        const rightDate = await app.utils.getDate(date)

        return `${leftDate.getFullHours()}:${leftDate.getFullMinutes()}:${leftDate.getFullSeconds()} —— ${rightDate.getFullHours()}:${rightDate.getFullMinutes()}:${rightDate.getFullSeconds()}`

        // const latest = new Date(date.getTime() - time)
        // return `${latest.getHours()}:${latest.getMinutes()}:${latest.getSeconds()} —— ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    public async getTech(tech: string | string[]) {
        const { ctx } = this;
        if (!Array.isArray(tech)) {

            const tech_noSymbol = tech.replace(' ', '').replace(/[,，.。\/\\]/g, ',').split(',');
            const techs = await ctx.service.tech.index();
            const key = techs.findIndex((val: any) => {
                for (const iterator of tech_noSymbol) {
                    if (val.keyword.match(RegExp(iterator))) {
                        return true;
                    }
                }
                return false
            })
            if (key !== -1) return techs[key]
            else return false
        } else {
            const techs = await ctx.service.tech.index();
            let keys = -1;
            for (const item of tech) {
                const tech_noSymbol = item.replace(' ', '').replace(/[&,，.。\/\\]/g, ',').split(',');
                const key = techs.findIndex((val: any) => {
                    for (const iterator of tech_noSymbol) {
                        if (val.keyword.match(RegExp(iterator))) {
                            return true;
                        }
                    }
                    return false
                })

                if (key !== -1) {
                    keys = key;
                    break;
                } else continue;
            }
            if (keys !== -1) return techs[keys]
            else return false
        }


    }

}