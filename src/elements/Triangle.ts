import Board from '@/views/Room/class/Board';
import BaseElement from './BaseElement';
import { GraphOptions } from './index';

// 三角形元素类
class Triangle extends BaseElement {
  private startX = 0;
  private startY = 0;

  constructor(userId: string, board: Board, options: GraphOptions) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
  }

  render() {
    this.board.ctx.beginPath();
    this.board.ctx.moveTo(this.startX + this.width / 2, this.startY);
    this.board.ctx.lineTo(this.startX + this.width, this.startY + this.height);
    this.board.ctx.lineTo(this.startX, this.startY + this.height);
    this.board.ctx.closePath();
    this.board.ctx.stroke();
  }
}

export default Triangle;
