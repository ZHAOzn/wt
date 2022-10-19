import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  public async transTime() {
    const { ctx } = this
    console.log(ctx.request.body);

    const { time } = ctx.request.body;

    ctx.body = await ctx.service.utils.getDate(time)
  }

}
