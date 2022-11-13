import BaseElement from '@/elements/BaseElement';
import Board from './Board';
import { drawElement } from './Draw';

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
    });
  }
  // 渲染击中元素
  renderHitElement(element?: BaseElement) {
    this.board.ctx.setLineDash([4, 3]);
    this.board.ctx.strokeStyle = 'blue';
    this.board.elements.activeElement?.render();
    this.board.ctx.setLineDash([]);
    this.board.ctx.strokeStyle = 'black';

    // this.board.ctx.save();
    // this.board.ctx.setLineDash([5]);
    // const options = {
    //   userId?: element;
    //   board: Board;
    //   type: ElementType;
    //   mouseDownX: number;
    //   mouseDownY: number;
    //   width: number;
    //   height: number;
    //   isSync: boolean;
    // }
    // drawElement(options);
    // this.board.ctx.restore();
  }
}

export default Render;
