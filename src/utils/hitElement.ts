import {
  isCheckAtMultiSegment,
  getCircleRadius,
  getTowPointDistance,
  isCheckInRectangle,
} from '@/utils';
import { ElementType, HIT_DISTANCE } from '@/elements';
import BaseElement from '@/elements/BaseElement';
import BaseLineElement from '@/elements/BaseLineElement';

export const isCheckAtElementEdge = (element: BaseElement, hitPoint: number[]) => {
  switch (element.type) {
    case ElementType.Rectangle:
      return isCheckAtRectangleEdge(element, hitPoint);
    case ElementType.Circle:
      return isCheckAtCircleEdge(element, hitPoint);
    case ElementType.Triangle:
      return isCheckAtTriangleEdge(element, hitPoint);
    case ElementType.Diamond:
      return isCheckAtDiamondEdge(element, hitPoint);
    case ElementType.SmoothLine:
      return isCheckAtSmoothLineEdge(element as BaseLineElement, hitPoint);
    case ElementType.StraightLine:
      return isCheckAtStraightLineEdge(element as BaseLineElement, hitPoint);
    case ElementType.Text:
      return isCheckAtTextElement(element as BaseLineElement, hitPoint);
    default:
      return false;
  }
};

// 检测是否点击到矩形边缘
export const isCheckAtRectangleEdge = (element: BaseElement, hitPoint: number[]) => {
  const { mouseDownX: x, mouseDownY: y, width, height } = element;
  const segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y],
  ];
  return isCheckAtMultiSegment(segments, hitPoint) ? element : null;
};

// 检测是否点击到圆的边缘
export const isCheckAtCircleEdge = (element: BaseElement, hitPoint: number[]) => {
  const { mouseDownX: x, mouseDownY: y, width, height } = element;
  const radius = getCircleRadius(width, height);
  const dis = getTowPointDistance(hitPoint[0], hitPoint[1], x + radius, y + radius);
  const onCircle = dis >= radius - HIT_DISTANCE && dis <= radius + HIT_DISTANCE;
  return onCircle ? element : null;
};

// 检测是否点击到菱形边缘
export const isCheckAtDiamondEdge = (element: BaseElement, hitPoint: number[]) => {
  const { mouseDownX: x, mouseDownY: y, width, height } = element;
  const segments = [
    [x + width / 2, y, x + width, y + height / 2],
    [x + width, y + height / 2, x + width / 2, y + height],
    [x + width / 2, y + height, x, y + height / 2],
    [x, y + height / 2, x + width / 2, y],
  ];
  return isCheckAtMultiSegment(segments, hitPoint) ? element : null;
};

// 检测是否点击到三角形边缘
export const isCheckAtTriangleEdge = (element: BaseElement, hitPoint: number[]) => {
  const { mouseDownX: x, mouseDownY: y, width, height } = element;
  const segments = [
    [x + width / 2, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x + width / 2, y],
  ];
  return isCheckAtMultiSegment(segments, hitPoint) ? element : null;
};

// 检测是否点击到直线边缘
export const isCheckAtStraightLineEdge = (element: BaseLineElement, hitPoint: number[]) => {
  const segments = [];
  const len = element.pointArr.length;
  const arr = element.pointArr;
  for (let i = 0; i < len - 1; i++) {
    segments.push([...arr[i], ...arr[i + 1]]);
  }
  return isCheckAtMultiSegment(segments, hitPoint) ? element : null;
};

// 检测是否点击到自由曲线边缘
export const isCheckAtSmoothLineEdge = (element: BaseLineElement, hitPoint: number[]) => {
  let res: any = null;
  element.pointArr.forEach((point) => {
    if (res) return;
    const dis = getTowPointDistance(hitPoint[0], hitPoint[1], point[0], point[1]);
    if (dis <= HIT_DISTANCE) {
      res = element;
    }
  });
  return res;
};

// 检测是否点击到文字--判断是否点击到矩形内部
export const isCheckAtTextElement = (element: BaseElement, hitPoint: number[]) => {
  return isCheckInRectangle(hitPoint, element) ? element : null;
};
