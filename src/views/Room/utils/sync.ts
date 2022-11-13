import { storeToRefs } from 'pinia';
import Board from '../class/Board';
import { exportJson } from './Export';

// Store
import { mainStore } from '@/store';

// Util
import { byteArrToString } from './byteArrToString';

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

const exportSync = (boards: Board[]) => {
  const data = exportJson(boards);

  ws.value?.sendWsMsg(userId.value!, roomId.value, 'export', { boards: data });
};

const importSync = (byteArr: any) => {
  const data = byteArrToString(byteArr);
};

export { exportSync, importSync };
