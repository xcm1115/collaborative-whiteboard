import Elements from './Elements';
import { ElementType } from '@/elements';
import Render from './Render';
import { storeToRefs } from 'pinia';

// Store
import { mainStore } from '@/store';

// Draw
import { drawRectangle } from './Draw';

type Option = {
  boardId: number;
  container: HTMLDivElement;
};

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

class Board {
  public boardId: number;
  public container: HTMLDivElement;
  public board: HTMLCanvasElement = document.createElement('canvas');
  public ctx: CanvasRenderingContext2D = this.board.getContext('2d')!;
  public elements: Elements;
  public render: Render;
  public drawType: ElementType;

  public width = 0;
  public height = 0;

  public isMouseDown = false;
  public mouseDownX = 0;
  public mouseDownY = 0;

  constructor(options: Option) {
    this.boardId = options.boardId;
    this.container = options.container;

    this.elements = new Elements(this);
    this.render = new Render(this);

    this.initBoard();
    this.bindEvent();

    // 默认箭头状态
    this.drawType = ElementType.Arrow;
  }

  setDrawType(drawType: string) {
    if (drawType === 'Rectangle') {
      this.drawType = ElementType.Rectangle;
    } else {
      this.drawType = ElementType.Arrow;
    }
  }

  getContainerInfo() {
    const { width, height } = this.container.getBoundingClientRect();

    this.width = width;
    this.height = height;
  }

  createBoard() {
    this.board.width = this.width;
    this.board.height = this.height;

    this.ctx?.translate(this.board.width / 2, this.board.height / 2);
  }

  initBoard() {
    this.getContainerInfo();
    this.createBoard();
    this.container.appendChild(this.board);
  }

  onMousedown(e: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }

    switch (this.drawType) {
      case ElementType.Rectangle:
        drawRectangle(
          this,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY,
          true
        );
        break;
      default:
        break;
    }
  }

  onMouseup(e?: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.elements.cancelActiveElement();

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'mouseup', null);
  }

  bindEvent() {
    this.board.addEventListener('mousedown', this.onMousedown.bind(this));
    this.board.addEventListener('mousemove', this.onMousemove.bind(this));
    this.board.addEventListener('mouseup', this.onMouseup.bind(this));
  }
}

export default Board;
