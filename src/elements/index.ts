import BaseElement from './BaseElement';
import Rectangle from './Rectangle';

export enum ElementType {
  Arrow = 'Arrow',
  SmoothLine = 'SmoothLine',
  StraightLine = 'StraightLine',
  Rectangle = 'Rectangle',
  Triangle = 'Triangle',
  Circle = 'Circle',
  Diamond = 'Diamond',
  Text = 'Text',
}

// 距离10像素内即击中目标element
export const HIT_DISTANCE = 10;
// 击中时绘制一个偏移量多5像素的同类型element
export const HIT_OFFECT = 5;

type GraphOptions = {
  type: ElementType;
  mouseDownX: number;
  mouseDownY: number;
  width: number;
  height: number;
};

export type { GraphOptions };

export default {
  BaseElement,
  Rectangle,
};
