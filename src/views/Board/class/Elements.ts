import Board from './Board';
import BaseElement from '@/elements/BaseElement';
import Rectangle from '@/elements/Rectangle';

enum ElementType {
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

    return this;
  }

  createElementByType(options: { type: ElementType }) {
    switch (options.type) {
      case ElementType.Rectangle:
        return new Rectangle(this.board, options);
      default:
        return null;
    }
  }

  createElement(options: any) {
    if (!this.activeElement) {
      const element = this.createElementByType(options);
      this.addElement(element!);
      this.setActiveElement(element!);
    }
  }

  createRectangle(x: number, y: number, width: number, height: number) {
    this.createElement({
      type: ElementType.Rectangle,
      x,
      y,
      width,
      height,
    });
    this.activeElement?.updateSize(width, height);
  }
}

export default Elements;
