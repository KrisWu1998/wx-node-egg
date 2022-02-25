'use strict';

const Controller = require('egg').Controller;
const WXBizDataCrypt = require('../../../utils/WXBizDataCrypt');

let sessionKey = '';
let openId = '';
let rawData = {};

class IndexController extends Controller {
  // wx.login
  async wxlogin() {
    const {
      ctx,
    } = this;
    const code = ctx.query.code || '';
    const result = await this.ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      method: 'GET',
      rejectUnauthorized: true,
      data: {
        js_code: code,
        appid: 'wxcec2936b91874d1b',
        secret: 'ed22a137e34ee57eed65ea6542669447',
        grant_type: 'authorization_code',
      },
      dataType: 'json',
    });
    try {
      sessionKey = result.data.session_key;
      openId = result.data.openid;
      ctx.body = {
        code: 200,
        message: '授权成功',
        data: result.data,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: '微信授权失败',
      };
    }
  }
  // 手机授权
  async wxGetUserInfo() {
    const {
      ctx,
      app,
    } = this;
    const {
      body,
    } = ctx.request;
    const {
      encryptedData,
      iv,
    } = body;
    const pc = new WXBizDataCrypt('wxcec2936b91874d1b', sessionKey);

    const data = pc.decryptData(encryptedData, iv);

    const reqValue = {
      ...rawData,
      phoneNumber: data.phoneNumber,
      sessionKey,
    };

    try {
      const isSave = await app.mysql.select('user_table', {
        openId,
      });
      if (isSave.length) {
        const {
          id,
        } = isSave;
        const row = {
          id,
          rawData: JSON.stringify(rawData),
          phone: data.phoneNumber || '',
        };
        await app.mysql.update('user_table', row);
      } else {
        await app.mysql.insert('user_table', {
          openId,
          rawData: JSON.stringify(rawData),
          phone: data.phoneNumber || '',
        });
      }
      ctx.body = {
        code: 200,
        message: '手机授权成功!',
        value: reqValue,
      };
    } catch (err) {

    }

  }
  // 用户信息授权
  async wxGetUserMsg() {
    const {
      ctx,
    } = this;
    const {
      body,
    } = ctx.request;
    rawData = JSON.parse(body.rawData) || {};
    console.log(body);
    ctx.body = {
      code: 200,
      message: '请求成功',
    };
  }
}

module.exports = IndexController;