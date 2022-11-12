import Board from '@/views/Room/class/Board';
import { ElementType } from '.';
import { GraphOptions } from './index';
import { isCheckAtElementEdge } from '@/utils/hitElement';

class BaseElement {
  private userId: string;
  public board: Board;
  public mouseDownX: number;
  public mouseDownY: number;
  public width: number;
  public height: number;
  public type: ElementType;
  public style: any;

  constructor(userId: string, board: Board, options: GraphOptions) {
    this.userId = userId;
    this.board = board;
    this.type = options.type;
    // 实时位置，该位置为元素的左上角坐标
    this.mouseDownX = options.mouseDownX || 0;
    this.mouseDownY = options.mouseDownY || 0;
    // 宽高
    this.width = options.width || 0;
    this.height = options.height || 0;
    // 样式
    this.style = {
      strokeStyle: '#000000', // 线条颜色
      fillStyle: 'transparent', // 填充颜色
      lineWidth: 'small', // 线条宽度
      lineDash: 0, // 线条虚线大小
      globalAlpha: 1, // 透明度
    };
  }

  // 序列化
  serialize() {
    return {
      type: this.type,
      width: this.width,
      height: this.height,
      mouseDownX: this.mouseDownX,
      mouseDownY: this.mouseDownY,
      style: {
        ...this.style,
      },
    };
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

  // 检测某元素是否被击中
  isHit(x: number, y: number) {
    console.log(this, x, y);
    console.log(isCheckAtElementEdge(this, [x, y]));
    return isCheckAtElementEdge(this, [x, y]);
  }
}

export default BaseElement;
