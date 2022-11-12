type User = {
  userId: string;
  userName: string;
  src: string;
};
import Board from '@/views/Room/class/Board';

type State = {
  isEditingBoardName: boolean;
};
type DrawOptions = {
  board: Board;
  mouseDownX: number;
  mouseDownY: number;
  width: number;
  height: number;
  isSync: boolean;
};

export type { User, State, DrawOptions };
