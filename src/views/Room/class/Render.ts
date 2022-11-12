import Board from './Board';
import { drawElement } from '@/views/Room/class/Draw';

class Render {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  // 清除画布
  clearBoard() {
    const { width, height } = this.board;
    this.board.ctx.clearRect(-width / 2, -height / 2, width, height);
  }

  // 绘制所有元素
  render() {
    // 清空画布
    this.clearBoard();
    // 渲染所有元素
    this.board.elements.elementList.forEach((element) => {
      element.render();
      // if (this.board.elements.activeElement === element) {
      //   this.board.ctx.strokeStyle = 'blue';
      //   element.render();
      // } else {
      //   this.board.ctx.strokeStyle = 'black';
      //   element.render();
      // }
    });
  }
}

export default Render;
