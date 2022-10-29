import Board from '@/views/Board/class/Board';

type Options = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class BaseElement {
  public board: Board;
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

  constructor(board: Board, options: Options) {
    this.board = board;
    // 实时位置，该位置为元素的左上角坐标
    this.x = options.x || 0;
    this.y = options.y || 0;
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
