import Board from '@/views/Board/class/Board';
import BaseElement from './BaseElement';
import { getFontString, splitTextLines } from '@/utils';
type TextStyle = {
  fillStyle: string;
  fontSize: number;
  lineHeightRatio: number;
  fontFamily: string;
};

// 文字类
class Text extends BaseElement {
  private startX = 0;
  private startY = 0;
  public text: string;
  public style: TextStyle;

  constructor(userId: string, board: Board, options: any) {
    super(userId, board, options);

    this.startX = this.mouseDownX - this.board.width / 2;
    this.startY = this.mouseDownY - this.board.height / 2;
    //先固定
    this.text = '';
    this.style = {} as TextStyle;
    this.style.fillStyle = '#000';
    this.style.fontSize = 18;
    this.style.lineHeightRatio = 1.5;
    this.style.fontFamily = '微软雅黑, Microsoft YaHei';
  }

  // 序列化
  serialize() {
    const base = super.serialize();
    return {
      ...base,
      text: this.text,
    };
  }

  render() {
    const { text, style } = this;
    const lineHeight = style.fontSize * style.lineHeightRatio;
    this.board.ctx.beginPath();
    this.board.ctx.font = getFontString(style.fontSize, style.fontFamily);
    this.board.ctx.textBaseline = 'middle';
    const textArr = splitTextLines(text);
    textArr.forEach((textRow, index) => {
      this.board.ctx.fillText(
        textRow,
        this.startX,
        this.startY + (index * lineHeight + lineHeight / 2)
      );
    });
    this.board.ctx.stroke();
  }
}

export default Text;
