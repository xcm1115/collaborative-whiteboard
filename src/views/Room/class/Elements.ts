import Board from './Board';
import { ElementType, GraphOptions } from '@/elements';
import BaseElement from '@/elements/BaseElement';
import Rectangle from '@/elements/Rectangle';
import Triangle from '@/elements/Triangle';
import Circle from '@/elements/Circle';
import SmoothLine from '@/elements/SmoothLine';
import StraightLine from '@/elements/StraightLine';
import Diamond from '@/elements/Diamond';
import BaseLineElement from '@/elements/BaseLineElement';
import Text from '@/elements/Text';
import { storeToRefs } from 'pinia';

// Type
import { DrawOptions } from '@/views/Room/types';

// Store
import { mainStore } from '@/store';

const store = mainStore();
const { userId } = storeToRefs(store);

class Elements {
  private board: Board;
  public elementList: BaseElement[];
  public activeElement: BaseElement | Text | null;

  constructor(board: Board) {
    this.board = board;
    this.elementList = [];
    this.activeElement = null;
  }

  // 序列化当前白板上的所有元素
  serialize(stringify = false) {
    const data = this.elementList.map((element) => {
      return element.serialize();
    });

    return stringify ? JSON.stringify(data) : data;
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

  // 删除元素
  deleteElement(element: BaseElement) {
    const index = this.getElementIndex(element);
    if (index !== -1) {
      this.elementList.splice(index, 1);
      if (element === this.activeElement) {
        this.cancelActiveElement();
      }
    }
    return this;
  }

  // 删除全部元素
  deleteAllElements() {
    this.activeElement = null;
    this.elementList = [];
  }

  // 获取元素在元素列表里的索引
  getElementIndex(element: BaseElement) {
    return this.elementList.findIndex((item) => {
      return item === element;
    });
  }

  createElementByType(userId: string, options: GraphOptions) {
    switch (options.type) {
      case ElementType.SmoothLine:
        return new SmoothLine(userId, this.board, options);
      case ElementType.StraightLine:
        return new StraightLine(userId, this.board, options);
      case ElementType.Rectangle:
        return new Rectangle(userId, this.board, options);
      case ElementType.Circle:
        return new Circle(userId, this.board, options);
      case ElementType.Triangle:
        return new Triangle(userId, this.board, options);
      case ElementType.Diamond:
        return new Diamond(userId, this.board, options);
      case ElementType.Text:
        return new Text(userId, this.board, options);
      default:
        return null;
    }
  }

  createElement(userId: string, options: GraphOptions) {
    if (!this.activeElement) {
      const element = this.createElementByType(userId, options);
      this.addElement(element!);
      this.setActiveElement(element!);
    }
  }

  // 单纯创建元素
  pureCreateElement(opts: BaseElement) {
    switch (opts.type) {
      case ElementType.Rectangle:
        return new Rectangle(userId.value!, this.board, opts);
      case ElementType.Circle:
        return new Circle(userId.value!, this.board, opts);
      case ElementType.Triangle:
        return new Triangle(userId.value!, this.board, opts);
      case ElementType.Diamond:
        return new Diamond(userId.value!, this.board, opts);
      case ElementType.SmoothLine:
        return new SmoothLine(userId.value!, this.board, opts);
      case ElementType.StraightLine:
        return new StraightLine(userId.value!, this.board, opts);
      default:
        return null;
    }
  }

  // 根据元素数据创建元素
  createElementsFromData(elements: BaseElement[]) {
    elements.forEach((item) => {
      const element = this.pureCreateElement(item);

      if (element) {
        this.addElement(element);
      }
    });
  }

  // 曲线
  createSmoothLine(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number,
    clientX: number,
    clientY: number
  ) {
    const data = {
      type: ElementType.SmoothLine,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    const element = this.activeElement as BaseLineElement;
    element?.addPoint(clientX, clientY);
  }

  // 直线
  createStraightLine(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number,
    clientX: number,
    clientY: number
  ) {
    const data = {
      type: ElementType.StraightLine,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    const element = this.activeElement as BaseLineElement;
    element.updateFictitiousPoint(clientX, clientY);
    element?.addPoint(mouseDownX, mouseDownY);
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

  // 创建三角形
  createTriangle(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number
  ) {
    const data = {
      type: ElementType.Triangle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    this.activeElement?.updateSize(width, height);
  }

  // 创建圆形
  createCircle(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number
  ) {
    const data = {
      type: ElementType.Circle,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    this.activeElement?.updateSize(width, height);
  }

  // 创建菱形
  createDiamond(
    userId: string,
    mouseDownX: number,
    mouseDownY: number,
    width: number,
    height: number
  ) {
    const data = {
      type: ElementType.Diamond,
      mouseDownX,
      mouseDownY,
      width,
      height,
    };

    this.createElement(userId, data);
    this.activeElement?.updateSize(width, height);
  }

  // 正在编辑文本元素
  // editingText(element: BaseElement) {
  //   if (element. !== 'text') {
  //     return
  //   }
  //   element.noRender = true
  //   this.setActiveElement(element)
  // }

  // 完成文本元素的编辑
  completeEditingText() {
    const element = this.activeElement as Text;
    if (!element || element.type !== ElementType.Text) {
      return;
    }
    if (!element.text.trim()) {
      // 没有输入则删除该文字元素
      this.deleteElement(element);
      this.cancelActiveElement();
      return;
    }
    // element.noRender = false;
  }
}

export default Elements;
