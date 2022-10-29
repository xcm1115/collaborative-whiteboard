import Elements from './Elements';
import Render from './Render';

type Option = {
  container: HTMLDivElement;
};

class Board {
  private container: HTMLDivElement;
  public board: HTMLCanvasElement = document.createElement('canvas');
  public ctx: CanvasRenderingContext2D = this.board.getContext('2d')!;
  public elements: Elements;
  private render: Render;

  public width = 0;
  public height = 0;

  private isMouseDown = false;
  private mouseDownX = 0;
  private mouseDownY = 0;

  constructor(options: Option) {
    this.container = options.container;

    this.elements = new Elements(this);
    this.render = new Render(this);

    this.initBoard();
    this.bindEvent();
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

    this.elements.createRectangle(
      this.mouseDownX,
      this.mouseDownY,
      e.clientX - this.mouseDownX,
      e.clientY - this.mouseDownY
    );

    this.render.render();
  }

  onMouseup(e: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.elements.cancelActiveElement();
  }

  bindEvent() {
    this.board.addEventListener('mousedown', this.onMousedown.bind(this));
    this.board.addEventListener('mousemove', this.onMousemove.bind(this));
    this.board.addEventListener('mouseup', this.onMouseup.bind(this));
  }
}

export default Board;
