import Board from '@/views/Board/class/Board';
import BaseElement from './BaseElement';
import Options from '@/elements/BaseElement';

class BaseLineElement extends BaseElement {
  protected startPointArr: [];
  protected pointArr: number[][];
  protected fictitiousPoint: Record<string, number>;

  constructor(userId: string, board: Board, options: Options) {
    super(userId, board, options);
    // 记录初始点位，在拖动时
    this.startPointArr = [];
    // 点位
    this.pointArr = [];
    // 鼠标当前实时位置，用于在绘制时显示线段最后一个点到当前鼠标的虚拟连接线
    this.fictitiousPoint = {
      x: 0,
      y: 0,
    };
  }

  // 序列化
  serialize() {
    const base = super.serialize();
    return {
      ...base,
      pointArr: [...this.pointArr],
    };
  }

  // 添加坐标，具有多个坐标数据的图形，如线段、自由线
  addPoint(x: number, y: number) {
    if (!Array.isArray(this.pointArr)) {
      return;
    }
    this.pointArr.push([x, y]);
    return this;
  }

  // 更新虚拟坐标点
  updateFictitiousPoint(x: number, y: number) {
    this.fictitiousPoint.x = x;
    this.fictitiousPoint.y = y;
  }

  // 保存元素初始状态
  saveState() {
    const { width, height, pointArr } = this;
    this.startPointArr = JSON.parse(JSON.stringify(pointArr));
    this.width = width;
    this.height = height;
    return this;
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

export default BaseLineElement;
