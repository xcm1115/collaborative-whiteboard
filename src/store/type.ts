type State = {
  userId: string | null;
  userName: string;
  userAvatar: string;
  token: string;
  ws: WebSocket | null;
};

export type { State };
