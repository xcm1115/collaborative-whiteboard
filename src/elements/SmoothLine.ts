import Board from '@/views/Room/class/Board';
import BaseLineElement from './BaseLineElement';
// import { GraphOptions } from './index';

// 自由曲线类
class SmoothLine extends BaseLineElement {
  private startX = 0;
  private startY = 0;
  private points: number[][];

  constructor(userId: string, board: Board, options: any) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
    this.points = this.pointArr;
  }

  render() {
    this.board.ctx.beginPath();
    for (let i = 0; i < this.points.length - 1; i++) {
      const point = this.transform(this.points[i]);
      const nextPoint = this.transform(this.points[i + 1]);
      this.drawLineSegment(point[0], point[1], nextPoint[0], nextPoint[1]);
    }
    this.board.ctx.stroke();
  }

  // 绘制线段
  drawLineSegment = (mx: number, my: number, tx: number, ty: number) => {
    this.board.ctx.moveTo(mx, my);
    this.board.ctx.lineTo(tx, ty);
    this.board.ctx.lineCap = 'round';
    this.board.ctx.lineJoin = 'round';
  };

  // 转换点坐标
  transform = (point = [0, 0]) => {
    if (!point.length) return [];
    const x = point[0] - this.board.width / 2;
    const y = point[1] - this.board.height / 2;
    return [x, y];
  };
}

export default SmoothLine;
