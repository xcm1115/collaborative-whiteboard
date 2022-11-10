import { RestfulVerify } from '@/api/restful';

class RegisterApi extends RestfulVerify {
  constructor() {
    const apiPrefix = '/';
    const url = `/register`;

    super(apiPrefix, {
      resource: url,
    });
  }
}

export default RegisterApi;
