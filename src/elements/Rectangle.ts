import Board from '@/views/Room/class/Board';
import BaseElement from './BaseElement';

// type Options = {
//   type: ElementType;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// };

// 矩形元素类
class Rectangle extends BaseElement {
  private startX = 0;
  private startY = 0;

  constructor(userId: string, board: Board, options: any) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
  }

  render() {
    this.board.ctx.beginPath();
    this.board.ctx.rect(this.startX, this.startY, this.width, this.height);
    this.board.ctx.stroke();
  }
}

export default Rectangle;
