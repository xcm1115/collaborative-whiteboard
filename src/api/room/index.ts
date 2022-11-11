import CreateRoomApi from './create-room';
import RoomListApi from './room-list';

// [GET]
const getRoomList = (postData: Record<string, unknown>) => {
  const api = new RoomListApi(postData.token as string);
  const res = api.index();

  return api.verifyJson(res);
};

// [POST]
const createRoom = (postData: Record<string, unknown>) => {
  const api = new CreateRoomApi(postData.token as string);
  const res = api.create(postData);

  return api.verifyJson(res);
};

export { getRoomList, createRoom };
