import Elements from './Elements';
import { ElementType } from '@/elements';
import Render from './Render';
import { storeToRefs } from 'pinia';
import { DrawOptions } from '../types';

// Store
import { mainStore } from '@/store';

// Draw
import { drawElement } from './Draw';
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
    this.textEdit = new TextEdit(this);

    this.initBoard();
    this.bindEvent();

    // 默认箭头状态
    this.drawType = ElementType.Arrow;
  }

  setDrawType(drawType: ElementType) {
    this.drawType = drawType;
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

  onMouseDbclick(e: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;
    //绘制文字时，显示编辑框
    if (this.drawType === ElementType.Text) {
      const options = {
        board: this,
        type: this.drawType,
        mouseDownX: this.mouseDownX,
        mouseDownY: this.mouseDownY,
        width: e.clientX - this.mouseDownX,
        height: e.clientY - this.mouseDownY,
        isSync: true,
      };
      this.createTextElement(options, e);
    }
  }

  onMousedown(e: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;
    if (this.drawType === ElementType.Arrow) {
      // 是否击中了某个元素
      const hitElement = this.elements.isCheckAtElement(e);
      this.elements.setActiveElement(hitElement);
      //增加击中样式
      // this.elements.setActiveElementStyle();
      this.ctx.strokeStyle = 'blue';
      this.elements.activeElement?.render();
      this.ctx.strokeStyle = 'black';
      // this.render.render();
    } else {
      this.render.render();
    }
  }

  onMousemove(e: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }
    const options = {
      board: this,
      type: this.drawType,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      width: e.clientX - this.mouseDownX,
      height: e.clientY - this.mouseDownY,
      isSync: true,
    };

    if (this.drawType === ElementType.Arrow) {
      return;
    }

    drawElement(options, e);
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
    this.board.addEventListener('dblclick', this.onMouseDbclick.bind(this));
  }

  // 创建文本元素
  createTextElement(options: DrawOptions, e: MouseEvent) {
    drawElement(options, e);
    // this.keyCommand.unBindEvent();
    this.textEdit.showTextEdit();
  }
}

export default Board;
