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
// // 计算一个文本元素的宽高
// export const getTextElementSize = (element: Text) => {
//   const { text, style } = element;
//   const width = getWrapTextActWidth(element);
//   const lines = Math.max(splitTextLines(text).length, 1);
//   const lineHeight = style.fontSize * style.lineHeightRatio;
//   const height = lines * lineHeight;
//   return {
//     width,
//     height,
//   };
// };
// // 计算换行文本的实际宽度
// export const getWrapTextActWidth = (element: Text) => {
//   const { text } = element;
//   const textArr = splitTextLines(text);
//   const maxWidth = -Infinity;
//   textArr.forEach((textRow) => {
//     const width = getTextActWidth(textRow, element.style);
//     if (width > maxWidth) {
//       maxWidth = width;
//     }
//   });
//   return maxWidth;
// };
// // 计算文本的实际渲染宽度
// let textCheckEl = null;
// export const getTextActWidth = (text, style) => {
//   if (!textCheckEl) {
//     textCheckEl = document.createElement('div');
//     textCheckEl.style.position = 'fixed';
//     textCheckEl.style.left = '-99999px';
//     document.body.appendChild(textCheckEl);
//   }
//   const { fontSize, fontFamily } = style;
//   textCheckEl.innerText = text;
//   textCheckEl.style.fontSize = fontSize + 'px';
//   textCheckEl.style.fontFamily = fontFamily;
//   const { width } = textCheckEl.getBoundingClientRect();
//   return width;
// };
