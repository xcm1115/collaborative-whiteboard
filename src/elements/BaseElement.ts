import Board from '@/views/Room/class/Board';
import { ElementType } from '.';

type Options = {
  type: ElementType;
  mouseDownX: number;
  mouseDownY: number;
  width: number;
  height: number;
};

class BaseElement {
  private userId: string;
  public board: Board;
  public mouseDownX: number;
  public mouseDownY: number;
  public width: number;
  public height: number;
  public type: ElementType;

  constructor(userId: string, board: Board, options: Options) {
    this.userId = userId;
    this.board = board;
    this.type = options.type;
    // 实时位置，该位置为元素的左上角坐标
    this.mouseDownX = options.mouseDownX || 0;
    this.mouseDownY = options.mouseDownY || 0;
    // 宽高
    this.width = options.width || 0;
    this.height = options.height || 0;
  }

  // 序列化
  serialize() {
    return {
      type: this.type,
      width: this.width,
      height: this.height,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
    };
  }

  // 渲染方法
  render() {
    throw new Error('render method must be implemented');
  }

  // 更新激活元素尺寸
  updateSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export default BaseElement;
