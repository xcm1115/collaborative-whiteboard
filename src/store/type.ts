import WS from '@/websocket';

type State = {
  userId: string | null;
  userName: string;
  userAvatar: string;
  token: string;
  ws: WS | null;
  roomId: string;
};

export type { State };
