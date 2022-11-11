import { RestfulVerify } from '@/api/restful';

class CreateBoardApi extends RestfulVerify {
  constructor(token: string) {
    const apiPrefix = '/auth';
    const url = `/room`;

    super(apiPrefix, {
      resource: url,
      headers: {
        token,
      },
    });
  }
}

export default CreateBoardApi;
