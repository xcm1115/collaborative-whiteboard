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

export default {
  BaseElement,
  Rectangle,
};
