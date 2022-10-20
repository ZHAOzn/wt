import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import database from './config.mysql'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1665457660357_2302';

  // add your egg config in here
  config.middleware = ["errorHandler"];

  config.customLoader = {
    utils: {
      directory: 'app/utils',
      inject: 'app'
    }
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.sequelize = {
    dialect: 'mysql',
    // host
    host: database.host,
    // 端口号
    port: database.port,
    // 用户名
    username: database.username,
    // 密码
    password: database.password,
    // 数据库名
    database: database.database,
    define: {
      // 添加createAt,updateAt,deleteAt时间戳
      timestamps: true,
      // 驼峰式字段默认转为下划线
      underscored: true,
      // 不允许修改表名
      freezeTableName: true,
    },
  };

  config.jwt = {
    secret: '123456',
    sign: {
      expiresIn: 60
    }

  };

  config.security = {
    csrf: {
      enable: false
      // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    },
  };




  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
