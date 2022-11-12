import { ElementType } from '@/elements';
import Board from '@/views/Room/class/Board';

type User = {
  userId: string;
  userName: string;
  src: string;
};

type State = {
  isFounder: boolean;
  isEditingBoardName: boolean;
};

type DrawOptions = {
  userId?: string;
  board: Board;
  type: ElementType;
  mouseDownX: number;
  mouseDownY: number;
  width: number;
  height: number;
  isSync: boolean;
};

export type { User, State, DrawOptions };
