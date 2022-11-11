type State = {
  loginModalVisible: boolean;
  joinBoardVisible: boolean;
  inputValue: string;
  loading: boolean;
  roomList: string[];
};

type LoginData = {
  id: string;
  token: string;
  rooms: string[];
};

type CreateRoomData = {
  roomId: string;
};

type RoomListData = {
  rooms: string[];
};

export type { State, LoginData, CreateRoomData, RoomListData };
