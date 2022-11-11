import Board from './Board';
import { storeToRefs } from 'pinia';

// Store
import { mainStore } from '@/store';

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

const drawRectangle = (
  board: Board,
  mouseDownX: number,
  mouseDownY: number,
  width: number,
  height: number,
  isSync: boolean
) => {
  board.elements.createRectangle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: 'Rectangle',
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

export { drawRectangle };
