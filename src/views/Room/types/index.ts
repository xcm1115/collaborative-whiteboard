import { ElementType } from '@/elements';
import Board from '@/views/Room/class/Board';

type RoomExistData = {
  exist: number;
};

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
  clientX: number;
  clientY: number;
  isSync: boolean;
};

type CheckIsOwnerData = {
  isOwner: boolean;
};

export type { RoomExistData, User, State, DrawOptions, CheckIsOwnerData };
