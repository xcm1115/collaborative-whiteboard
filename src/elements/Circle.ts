import Board from '@/views/Board/class/Board';
import BaseElement from './BaseElement';
import { getCircleRadius } from '@/utils';
import ws from '@/websocket/events';

// type Options = {
//   type: ElementType;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// };

// 原型元素类
class Circle extends BaseElement {
  private startX = 0;
  private startY = 0;
  private radius = 0;

  constructor(userId: string, board: Board, options: any) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
  }

  render() {
    this.radius = getCircleRadius(this.width, this.height);
    this.board.ctx.beginPath();
    this.board.ctx.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI);
    this.board.ctx.stroke();
  }
}

export default Circle;
