
export class AlDate {
    timestamp: number;
    date: Date;
    day: number;
    month: number;
    year: number;
    dayOfWeek: number;
    hours: number;
    minutes: number;
    seconds: number;

    constructor(date?: Date | string | number) {
        if (!date) this.date = new Date()
        else
            if (date instanceof Date) this.date = date;
            else this.date = new Date(date)

        if (!(this.date instanceof Date)) this.date = new Date();

        this.timestamp = this.date.getTime();
        this.day = this.date.getDate();
        this.month = this.date.getMonth() + 1;
        this.year = this.date.getFullYear();
        this.dayOfWeek = this.date.getDay();
        this.hours = this.date.getHours();
        this.minutes = this.date.getMinutes();
        this.seconds = this.date.getSeconds();
    }

    /**
     * 获取完整月份
     * @returns 月份，例："01"
     */
    getFullMonth = (): string => {
        return this.month < 10 ? `0${this.month}` : String(this.month)
    }

    /**
     * 获取完整日子
     * @returns 日子，例："01"
     */
    getFullDay = (): string => {
        return this.day < 10 ? `0${this.day}` : String(this.day)
    }

    /**
     * 获取完整小时
     * @returns 小时，补0
     */
    getFullHours = (): string => {
        return this.hours < 10 ? `0${this.hours}` : String(this.hours)
    }

    /**
     * 获取完整分钟
     * @returns 完整分钟，补0
     */
    getFullMinutes = (): string => {
        return this.minutes < 10 ? `0${this.minutes}` : String(this.minutes)
    }

    /**
     * 获取完整秒数
     * @returns 完整秒数，补0
     */
    getFullSeconds = (): string => {
        return this.seconds < 10 ? `0${this.seconds}` : String(this.seconds)
    }

    /**
     * 获取完整日期
     * @param key 哪一个key截止
     * @param fullOpt 是否补0
     * @returns 完整日期，例："2022 年 08 月 11 日 14 时 57 分 14 秒"
     */
    getFullDate = (key: string = 'seconds', fullOpt: boolean = false): string => {
        const keys = new Map([['year', '年'], ['month', '月'], ['day', '日'], ['hours', '时'], ['minutes', '分'], ['seconds', '秒']])
        let fullDate = ""

        for (const [item, index] of keys) {
            if (fullOpt) {
                const val = this[`getFull${item.charAt(0).toUpperCase() + item.slice(1)}` as keyof this] ?? this[item as keyof this]
                fullDate = `${fullDate} ${typeof val === 'function' ? val() : val} ${index}`
            } else fullDate = `${fullDate} ${this[item as keyof this]} ${index}`

            if (key && key !== item) continue;
            else if (!key) continue;
            else break;
        }
        return fullDate;
    }
}

const getDate = async (date?: Date | string | number) => {
    return new AlDate(date)
}
export default getDate