import Board from './Board';
import BaseElement from '@/elements/BaseElement';
import Rectangle from '@/elements/Rectangle';

export enum ElementType {
  Rectangle = 'rectangle',
}

class Elements {
  private board: Board;
  public elementList: BaseElement[];
  private activeElement: BaseElement | null;

  constructor(board: Board) {
    this.board = board;
    this.elementList = [];
    this.activeElement = null;
  }

  // 添加元素
  addElement(element: BaseElement) {
    this.elementList.push(element);
  }

  cancelActiveElement() {
    this.activeElement = null;
  }

  setActiveElement(element: BaseElement) {
    this.cancelActiveElement();

    if (element) {
      this.activeElement = element;
    }
  }

  createElementByType(userId: string, options: any) {
    switch (options.type) {
      case ElementType.Rectangle:
        return new Rectangle(userId, this.board, options);
      default:
        return null;
    }
  }

  createElement(userId: string, options: any) {
    if (!this.activeElement) {
      const element = this.createElementByType(userId, options);
      this.addElement(element!);
      this.setActiveElement(element!);
    }
  }

  // 创建矩形
  createRectangle(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number
  ) {
    const data = {
      type: ElementType.Rectangle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    this.activeElement?.updateSize(width, height);
  }
}

export default Elements;
