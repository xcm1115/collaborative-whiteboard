import CreateRoomApi from './create-room';
import RoomListApi from './room-list';
import RoomExistApi from './room-exist';
import IsOwnerApi from './is-owner';
import DeleteRoomApi from './delete-room';

// [GET]
const getRoomList = (postData: Record<string, unknown>) => {
  const api = new RoomListApi(postData.token as string);
  const res = api.index();

  return api.verifyJson(res);
};

const checkRoomExist = (postData: Record<string, unknown>) => {
  const api = new RoomExistApi(postData.token as string, postData.roomId as string);
  const res = api.index();

  return api.verifyJson(res);
};

const checkIsOwner = (postData: Record<string, unknown>) => {
  const api = new IsOwnerApi(postData.token as string, postData.roomId as string);
  const res = api.index();

  return api.verifyJson(res);
};

// [POST]
const createRoom = (postData: Record<string, unknown>) => {
  const api = new CreateRoomApi(postData.token as string);
  const res = api.create(postData);

  return api.verifyJson(res);
};

// [DELETE]
const deleteRoom = (postData: Record<string, unknown>) => {
  const api = new DeleteRoomApi(postData.token as string, postData.roomId as string);
  const res = api.destroy();

  return api.verifyJson(res);
};

export { getRoomList, checkRoomExist, checkIsOwner, createRoom, deleteRoom };
