import Board from '@/views/Board/class/Board';

type Options = {
  mouseDownX: number;
  mouseDownY: number;
  width: number;
  height: number;
};

class BaseElement {
  private userId: string;
  public board: Board;
  protected mouseDownX: number;
  protected mouseDownY: number;
  protected width: number;
  protected height: number;

  constructor(userId: string, board: Board, options: Options) {
    this.userId = userId;
    this.board = board;
    // 实时位置，该位置为元素的左上角坐标
    this.mouseDownX = options.mouseDownX || 0;
    this.mouseDownY = options.mouseDownY || 0;
    // 宽高
    this.width = options.width || 0;
    this.height = options.height || 0;
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
