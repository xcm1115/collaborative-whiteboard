// 计算两点之间的距离
export const getTowPointDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

// 根据宽高计算圆的半径
export const getCircleRadius = (width: number, height: number) => {
  return Math.min(Math.abs(width), Math.abs(height)) / 2;
};

// 拼接文字字体字号字符串
export const getFontString = (fontSize: number, fontFamily: string) => {
  return `${fontSize}px ${fontFamily}`;
};

// 文本切割成行
export const splitTextLines = (text: string) => {
  return text.replace(/\r\n?/g, '\n').split('\n');
};

// 计算点到直线的距离
export const getPointToLineDistance = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  // 直线垂直于x轴
  if (x1 === x2) {
    return Math.abs(x - x1);
  } else {
    const B = 1;
    const A = (y1 - y2) / (x2 - x1);
    const C = 0 - B * y1 - A * x1;
    return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B));
  }
};

// 检测是否点击到折线上
export const isCheckAtMultiSegment = (segments: number[][], rp = [0, 0]) => {
  let res = false;
  console.log(segments);
  segments.forEach((seg = [0, 0, 0, 0]) => {
    if (res) return;
    if (isCheckAtSegment(rp[0], rp[1], seg[0], seg[1], seg[2], seg[3])) {
      res = true;
    }
  });
  console.log(res);
  return res;
};

// 检查是否点击到了一条线段
export const isCheckAtSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dis = 10
) => {
  if (getPointToLineDistance(x, y, x1, y1, x2, y2) > dis) {
    console.log(1);
    return false;
  }
  const dis1 = getTowPointDistance(x, y, x1, y1);
  const dis2 = getTowPointDistance(x, y, x2, y2);
  const dis3 = getTowPointDistance(x1, y1, x2, y2);
  const max = Math.sqrt(dis * dis + dis3 * dis3);
  if (dis1 <= max && dis2 <= max) {
    console.log(2);
    return true;
  }
  return false;
};
