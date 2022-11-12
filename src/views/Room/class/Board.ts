import BaseElement from '@/elements/BaseElement';
import Elements from './Elements';
import { ElementType } from '@/elements';
import Render from './Render';
import { storeToRefs } from 'pinia';
import { DrawOptions } from '../types';

// Store
import { mainStore } from '@/store';

// Draw
import {
  drawRectangle,
  drawCircle,
  drawDiamond,
  drawSmoothLine,
  drawStraightLine,
  // drawTextElement,
  drawTriangle,
} from './Draw';
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
  public render: Render;
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
      case ElementType.Arrow:
        this.drawType = ElementType.Arrow;
        break;
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

  // 设置元素数据
  async setData({ elements = [] }) {
    this.elements.deleteAllElements();
    this.elements.createElementsFromData(elements);
    this.render.render();
  }

  // 获取数据，包括状态数据及元素数据
  getData() {
    return {
      elements: this.elements.serialize(),
    };
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
    const options = {
      board: this,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      width: e.clientX - this.mouseDownX,
      height: e.clientY - this.mouseDownY,
      isSync: true,
    };

    if (this.drawType === ElementType.Arrow) {
      return;
    }

    switch (this.drawType) {
      case ElementType.SmoothLine:
        drawSmoothLine(options, e);
        break;
      case ElementType.StraightLine:
        drawStraightLine(options, e);
        break;
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
      // case ElementType.Text:
      //   this.createTextElement(options);
      //   break;
      default:
        break;
    }
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
  createTextElement(options: DrawOptions) {
    drawTextElement(options);
    // this.keyCommand.unBindEvent();
    this.textEdit.showTextEdit();
  }
}

export default Board;
