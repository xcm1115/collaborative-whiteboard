import { DrawOptions } from '../types';
import { storeToRefs } from 'pinia';
import { ElementType } from '@/elements';

// Store
import { mainStore } from '@/store';

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

const drawElement = (options: DrawOptions) => {
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
      drawSmoothLine(options);
      break;
    case ElementType.StraightLine:
      drawStraightLine(options);
      break;
    // case ElementType.Text:
    //   drawTextElement(options);
    //   break;
    default:
      break;
  }

  if (options.isSync) {
    const data = {
      boardId: options.board.boardId,
      type: options.type,
      width: options.width,
      height: options.height,
      mouseDownX: options.mouseDownX,
      mouseDownY: options.mouseDownY,
      clientX: options.clientX,
      clientY: options.clientY,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'draw', data);
  }
};

const drawSmoothLine = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, clientX, clientY, isSync } = options;
  board.elements.createSmoothLine(
    userId.value!,
    mouseDownX,
    mouseDownY,
    width,
    height,
    clientX,
    clientY
  );
  board.render.render();
};

const drawStraightLine = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, clientX, clientY, isSync } = options;
  board.elements.createStraightLine(
    userId.value!,
    mouseDownX,
    mouseDownY,
    width,
    height,
    clientX,
    clientY
  );
  board.render.render();
};

const drawRectangle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createRectangle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();
};

const drawCircle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createCircle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();
};

const drawTriangle = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createTriangle(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();
};

const drawDiamond = (options: DrawOptions) => {
  const { board, mouseDownX, mouseDownY, width, height, isSync } = options;
  board.elements.createDiamond(userId.value!, mouseDownX, mouseDownY, width, height);
  board.render.render();
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

export {
  drawElement,
  drawSmoothLine,
  drawStraightLine,
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawDiamond,
};
