import { DrawOptions } from '../types';
import { storeToRefs } from 'pinia';
import { ElementType } from '@/elements';

// Store
import { mainStore } from '@/store';

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

const drawElement = (options: DrawOptions, e: MouseEvent) => {
  switch (options.type) {
    case ElementType.Rectangle:
      drawRectangle(options);
      break;
    case ElementType.Circle:
      drawCircle(options);
      break;
    case ElementType.Triangle:
      drawTriangle(options);
      break;
    case ElementType.Diamond:
      drawDiamond(options);
      break;
    case ElementType.SmoothLine:
      drawSmoothLine(options, e);
      break;
    case ElementType.StraightLine:
      drawStraightLine(options, e);
      break;
    // case ElementType.Text:
    //   drawTextElement(options);
    //   break;
    default:
      break;
  }
};

const drawSmoothLine = (options: DrawOptions, e: MouseEvent) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createSmoothLine(userId.value!, mouseDownX, mouseDownY, width, height, e);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.SmoothLine,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawStraightLine = (options: DrawOptions, e: MouseEvent) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createStraightLine(userId.value!, mouseDownX, mouseDownY, width, height, e);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.StraightLine,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawRectangle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createRectangle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.Rectangle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawCircle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createCircle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.Circle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawTriangle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createTriangle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.Triangle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawDiamond = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createDiamond(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();

  if (isSync) {
    const data = {
      boardId: board.boardId,
      type: ElementType.Diamond,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

// const drawTextElement = (options: DrawOptions) => {
//   const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
//   const data = {
//     type: ElementType.Text,
//     mouseDownX,
//     mouseDownY,
//     width,
//     height,
//   };
//   board.elements.createElement(userId.value!, data);
//   board.elements.activeElement?.updateSize(width, height);
//   board.render.render();

//   if (isSync) {
//     const data = {
//       boardId: board.boardId,
//       type: ElementType.Text,
//       mouseDownX,
//       mouseDownY,
//       width,
//       height,
//     };

//     ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
//   }
// };

export { drawElement };
