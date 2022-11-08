import ws from '@/websocket/events';
import { nanoid } from 'nanoid';
import Elements from './Elements';
import { ElementType } from '@/elements';
import Render from './Render';

type Option = {
  container: HTMLDivElement;
};

class Board {
  public userId: string;
  private container: HTMLDivElement;
  public board: HTMLCanvasElement = document.createElement('canvas');
  public ctx: CanvasRenderingContext2D = this.board.getContext('2d')!;
  public elements: Elements;
  private render: Render;
  private drawType: ElementType;

  public width = 0;
  public height = 0;

  private isMouseDown = false;
  private mouseDownX = 0;
  private mouseDownY = 0;

  constructor(options: Option) {
    this.userId = nanoid();
    this.container = options.container;

    this.elements = new Elements(this);
    this.render = new Render(this);

    this.initBoard();
    this.bindEvent();

    // 暂时写死
    this.drawType = ElementType.Rectangle;
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

  sendWsMsg(userId: string, operation: string, data: Record<string, unknown> | null) {
    const msg = {
      userId,
      operation,
      data,
    };

    ws.send(JSON.stringify(msg));
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

    // switch (this.drawType) {
    //   case ElementType.Rectangle:
    //     break;

    //   default:
    //     break;
    // }

    this.elements.createRectangle(
      this.userId,
      this.mouseDownX,
      this.mouseDownY,
      e.clientX - this.mouseDownX,
      e.clientY - this.mouseDownY
    );

    this.render.render();

    const data = {
      type: 'Rectangle',
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      width: e.clientX - this.mouseDownX,
      height: e.clientY - this.mouseDownY,
    };

    this.sendWsMsg(this.userId, 'draw', data);
  }

  onMouseup(e: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.elements.cancelActiveElement();

    this.sendWsMsg(this.userId, 'mouseup', null);
  }

  bindEvent() {
    this.board.addEventListener('mousedown', this.onMousedown.bind(this));
    this.board.addEventListener('mousemove', this.onMousemove.bind(this));
    this.board.addEventListener('mouseup', this.onMouseup.bind(this));
  }
}

export default Board;
