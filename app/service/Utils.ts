import { Service } from 'egg';

export default class Utils extends Service {

    /**取固定范围间的随机整数
     * @param min -最小值（包含）
     * @param max -最大值（包含）
     */
    public async getRandomInt(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.ceil(max)
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 转化从WT官网爬取的时间为标准格式
     * @param date 从WT官网爬取来的时间
     * @returns Date对象
     */
    public async getDate(date: string) {
        const arr = date.split(" ")
        return new Date(`${arr[2]}-${await this.translateMonthFromCN(arr[1])}-${arr[0]}`)
    }

    /**
     * 转化中/英文月份为阿拉伯数字格式
     * @param month 中文月份，例："九月"
     * @returns 阿拉伯数字格式月份，例："09"
     */
    public async translateMonthFromCN(month: string) {
        const mth = new Map([['一月', '01'], ['二月', '02'], ['三月', '03'], ['四月', '04'], ['五月', '05'], ['六月', '06'], ['七月', '07'], ['八月', '08'], ['九月', '09'], ['十月', '10'], ['十一月', '11'], ['十二月', '12'], ['January', '01'], ['February', '02'], ['March', '03'], ['April', '04'], ['May', '05'], ['June', '06'], ['July', '07'], ['August', '08'], ['September', '09'], ['October', '10'], ['November', '11'], ['December', '12']])
        return mth.get(month)
    }
}