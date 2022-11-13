import { RestfulVerify } from '@/api/restful';

class DeleteBoardApi extends RestfulVerify {
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

export default DeleteBoardApi;
