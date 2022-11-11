import { RestfulVerify } from '@/api/restful';

class RoomListApi extends RestfulVerify {
  constructor(token: string) {
    const apiPrefix = '/auth';
    const url = `/rooms`;

    super(apiPrefix, {
      resource: url,
      headers: {
        token,
      },
    });
  }
}

export default RoomListApi;
