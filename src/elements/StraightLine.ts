import Board from '@/views/Board/class/Board';
import BaseLineElement from './BaseLineElement';
// import { transform } from '@/utils';
import ws from '@/websocket/events';

// 直线类
class StraightLine extends BaseLineElement {
  private startX = 0;
  private startY = 0;

  constructor(userId: string, board: Board, options: any) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
  }

  render() {
    const { pointArr, fictitiousPoint } = this;
    this.board.ctx.beginPath();
    // 鼠标当前实时位置
    let realtimePoint: number[] = [];
    if (pointArr.length > 0) {
      realtimePoint = this.transform([fictitiousPoint.x, fictitiousPoint.y]);
    }
    this.drawLine(
      pointArr
        .map((point) => {
          return this.transform(point);
        })
        .concat([realtimePoint])
    );
    this.board.ctx.stroke();
  }

  // 绘制直线
  drawLine = (points: number[][]) => {
    let isFirstPoint = true;
    points.forEach((point) => {
      if (isFirstPoint) {
        isFirstPoint = false;
        this.board.ctx.moveTo(point[0], point[1]);
      } else {
        this.board.ctx.lineTo(point[0], point[1]);
      }
    });
  };

  // 转换点坐标
  transform = (point = [0, 0]) => {
    if (!point.length) return [];
    const x = point[0] - this.board.width / 2;
    const y = point[1] - this.board.height / 2;
    return [x, y];
  };
}

export default StraightLine;
