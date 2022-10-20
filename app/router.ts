import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/checkdev', controller.dev.checkDev)
  router.get('/checkdev/detail', controller.dev.checkDevDetail)
  router.get('/dev/index', controller.dev.index)
  router.post('/dev/insert', controller.dev.insert)
  router.get('/dev/record', controller.recordCheck.index)


  router.get('/dev/detail/:id', controller.dev.detail)
  router.post('/transTime', controller.home.transTime)
};
