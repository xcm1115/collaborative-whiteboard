import { isCheckAtMultiSegment } from '@/utils';
import { ElementType } from '@/elements';
import BaseElement from '@/elements/BaseElement';

export const isCheckAtElementEdge = (element: BaseElement, rp: number[]) => {
  switch (element.type) {
    case ElementType.Rectangle:
      console.log(111);
      return isCheckAtRectangleEdge(element, rp);
    // case ElementType.Circle:
    //   drawCircle(options);
    //   break;
    // case ElementType.Triangle:
    //   drawTriangle(options);
    //   break;
    // case ElementType.Diamond:
    //   drawDiamond(options);
    //   break;
    // case ElementType.SmoothLine:
    //   drawSmoothLine(options, e);
    //   break;
    // case ElementType.StraightLine:
    //   drawStraightLine(options, e);
    //   break;
    // case ElementType.Text:
    //   drawTextElement(options);
    //   break;
    default:
      break;
  }
};

// 检测是否点击到矩形边缘
export const isCheckAtRectangleEdge = (element: BaseElement, rp: number[]) => {
  const { mouseDownX: x, mouseDownY: y, width, height } = element;
  const segments = [
    [x, y, x + width, y],
    [x + width, y, x + width, y + height],
    [x + width, y + height, x, y + height],
    [x, y + height, x, y],
  ];
  return isCheckAtMultiSegment(segments, rp) ? element : null;
};
