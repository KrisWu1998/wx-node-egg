'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // wx 登录板块
  router.get('/wx/login', controller.login.index.wxlogin);
  router.post('/wx/savePhone', controller.login.index.wxGetUserInfo);
};
