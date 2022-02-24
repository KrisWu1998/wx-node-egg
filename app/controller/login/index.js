'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
let sessionKey = '';

class IndexController extends Controller {
  async wxlogin() {
    const { ctx } = this;
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
  async wxGetUserInfo() {
    const { ctx } = this;
    const { body } = ctx.request;
    const { encryptedData, iv } = body;
    console.log('crypto', crypto)
    const ivStr = Buffer.from(iv, 'base64');
    const encryStr = Buffer.from(encryptedData, 'base64');
    console.log(myiv, myEncryptedData);
  }
}

module.exports = IndexController;
