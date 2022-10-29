import Board from '@/views/Board/class/Board';
import BaseElement from './BaseElement';

// 矩形元素类
class Rectangle extends BaseElement {
  constructor(board: Board, options: any) {
    super(board, options);
  }

  render() {
    this.board.ctx.beginPath();
    this.board.ctx.rect(
      this.x - this.board.width / 2,
      this.y - this.board.height / 2,
      this.width,
      this.height
    );
    this.board.ctx.stroke();
  }
}

export default Rectangle;
