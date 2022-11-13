import { RestfulVerify } from '@/api/restful';

class IsOwnerApi extends RestfulVerify {
  constructor(token: string, roomId: string) {
    const apiPrefix = '/auth';
    const url = `/room/${roomId}/isOwner`;

    super(apiPrefix, {
      resource: url,
      headers: {
        token,
      },
    });
  }
}

export default IsOwnerApi;
