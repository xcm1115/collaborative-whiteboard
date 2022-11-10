type State = {
  loginModalVisible: boolean;
  joinBoardVisible: boolean;
  inputValue: string;
  loading: boolean;
};

type LoginData = {
  id: string;
  token: string;
  rooms: string[];
};

type CreateBoardData = {
  roomId: string;
};

export type { State, LoginData, CreateBoardData };
