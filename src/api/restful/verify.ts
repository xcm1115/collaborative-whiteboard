import { RestfulClient } from './client';
import { RestfulResponseJSON, RestfulClientVerifyInit } from './types';

class RestfulVerify extends RestfulClient {
  // 是否验证返回码
  verifyCode = false;
  // 正确返回码
  verifyCodeEqual = '0';
  verifyCodeField = 'code';
  verifyMsgField = 'message';
  // 是否直接全局提示显示错误信息
  showMessage = false;
  hasAbNormalCode = false;

  constructor(baseUrl: string, options: RestfulClientVerifyInit) {
    const baseOpts: RestfulClientVerifyInit = {
      parseJson: true,
      verifyCode: true,
      verifyCodeEqual: '0',
      verifyCodeField: 'code',
      verifyMsgField: 'message',
      showMessage: false,
      hasAbNormalCode: false,
      ...options,
    };
    super(baseUrl, baseOpts);

    this.verifyCode = baseOpts.verifyCode !== false;
    this.verifyCodeEqual = baseOpts.verifyCodeEqual || '0';
    this.verifyCodeField = baseOpts.verifyCodeField || 'code';
    this.verifyMsgField = baseOpts.verifyMsgField || 'message';
    this.showMessage = baseOpts.showMessage !== false;
    this.hasAbNormalCode = baseOpts.hasAbNormalCode || false;
  }

  verifyJson<T extends RestfulResponseJSON>(result: Promise<Response>) {
    // 验证返回 code 值
    const { verifyCodeField, verifyCodeEqual, verifyMsgField, showMessage } = this;
    return new Promise<T>((resolve, reject) => {
      const ret = this.parseJson ? result : result.then(RestfulClient.json);

      ret
        .then((json) => {
          if (this.hasAbNormalCode) {
            resolve(json);
            return;
          }
          if (String(json[verifyCodeField]) !== String(verifyCodeEqual)) {
            if (showMessage) {
              reject();
              return;
            }
            reject(new Error(json[verifyMsgField]));
            return;
          }
          resolve(json);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export { RestfulVerify };
