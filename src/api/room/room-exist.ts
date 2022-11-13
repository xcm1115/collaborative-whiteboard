import { RestfulVerify } from '@/api/restful';

class RoomExistApi extends RestfulVerify {
  constructor(token: string, roomId: string) {
    const apiPrefix = '/auth';
    const url = `/room/${roomId}`;

    super(apiPrefix, {
      resource: url,
      headers: {
        token,
      },
    });
  }
}

export default RoomExistApi;
