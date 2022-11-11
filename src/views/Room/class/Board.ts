import Elements from './Elements';
import { ElementType } from '@/elements';
import Render from './Render';
import { storeToRefs } from 'pinia';

// Store
import { mainStore } from '@/store';

// Draw
import { drawRectangle } from './Draw';
import TextEdit from '@/helper/TextEdit';

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
  private render: Render;
  private drawType: ElementType;
  private textEdit: TextEdit;

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

    // 文字编辑类
    this.textEdit = new TextEdit(this);
    this.textEdit.bindCallBack = this.onTextInputBlur;
    // this.textEdit.on('blur', this.onTextInputBlur, this);
  }

  setDrawType(drawType: string) {
    switch (drawType) {
      case ElementType.SmoothLine:
        this.drawType = ElementType.SmoothLine;

        break;
      case ElementType.StraightLine:
        this.drawType = ElementType.StraightLine;

        break;

      case ElementType.Rectangle:
        this.drawType = ElementType.Rectangle;

        break;
      case ElementType.Circle:
        this.drawType = ElementType.Circle;

        break;
      case ElementType.Triangle:
        this.drawType = ElementType.Triangle;

        break;
      case ElementType.Diamond:
        this.drawType = ElementType.Diamond;

        break;
      case ElementType.Text:
        this.drawType = ElementType.Text;

        break;

      default:
        this.drawType = ElementType.Arrow;
        break;
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
      case ElementType.SmoothLine:
        this.elements.createSmoothLine(
          this.userId,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY,
          e
        );

        break;
      case ElementType.StraightLine:
        this.elements.createStraightLine(
          this.userId,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY,
          e
        );

        break;
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
      case ElementType.Circle:
        this.elements.createCircle(
          this.userId,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY
        );

        break;
      case ElementType.Triangle:
        this.elements.createTriangle(
          this.userId,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY
        );

        break;
      case ElementType.Diamond:
        this.elements.createDiamond(
          this.userId,
          this.mouseDownX,
          this.mouseDownY,
          e.clientX - this.mouseDownX,
          e.clientY - this.mouseDownY
        );

        break;
      case ElementType.Text:
        this.createTextElement(e);

        break;

      default:
        break;
    }
    this.render.render();

    const data = {
      type: this.drawType,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      width: e.clientX - this.mouseDownX,
      height: e.clientY - this.mouseDownY,
    };

    this.sendWsMsg(this.userId, 'draw', data);
  }

  onMouseup(e?: MouseEvent) {
    this.isMouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    if (this.elements.activeElement && this.elements.activeElement.type === ElementType.Text)
      return;
    this.elements.cancelActiveElement();

    ws.value!.sendWsMsg(userId.value!, roomId.value, 'mouseup', null);
  }

  bindEvent() {
    this.board.addEventListener('mousedown', this.onMousedown.bind(this));
    this.board.addEventListener('mousemove', this.onMousemove.bind(this));
    this.board.addEventListener('mouseup', this.onMouseup.bind(this));
  }

  // 文本框失焦事件
  onTextInputBlur() {
    // this.keyCommand.bindEvent();
    this.elements.completeEditingText();
    this.render.render();
    // this.emitChange();
  }

  // 创建文本元素
  createTextElement(e: MouseEvent) {
    const data = {
      type: ElementType.Text,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      width: e.clientX - this.mouseDownX,
      height: e.clientY - this.mouseDownY,
    };
    this.elements.createElement(this.userId, data);
    this.elements.activeElement?.updateSize(
      e.clientX - this.mouseDownX,
      e.clientY - this.mouseDownY
    );
    // this.keyCommand.unBindEvent();
    this.textEdit.showTextEdit();
  }
}

export default Board;
