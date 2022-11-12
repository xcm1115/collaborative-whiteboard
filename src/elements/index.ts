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
