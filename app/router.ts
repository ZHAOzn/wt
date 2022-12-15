import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/checkdev', controller.dev.checkDev)
  router.get('/checkdev/detail', controller.dev.checkDevDetail)


  /**
   * 获取版本列表
   */
  router.get('/version/list', controller.version.index)

  /**
   * 新增版本
   */
  router.post('/version/insert', controller.version.insert)

  /**
   * 更新版本信息
   */
  router.post('/version/update', controller.version.update)


  /**
   * 爬取dev
   */
  router.get('/dev/checkdevs', controller.dev.checkOldDevs)
  //dev列表
  router.get('/dev/index', controller.dev.index)
  //dev详情
  router.get('/dev/detail/:id', controller.dev.detail)

  router.post('/dev/insert', controller.dev.insert)

  //dev检索记录
  router.get('/dev/record', controller.recordCheck.index)

  //系别列表
  router.get('/tech/list', controller.tech.index)
  //判断是否系别
  router.get('/tech/query', controller.tech.getTech)


  router.post('/transTime', controller.home.transTime)
};
