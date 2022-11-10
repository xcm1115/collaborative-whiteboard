import { RestfulVerify } from '@/api/restful';

class LoginApi extends RestfulVerify {
  constructor() {
    const apiPrefix = '/';
    const url = `/login`;

    super(apiPrefix, {
      resource: url,
    });
  }
}

export default LoginApi;
