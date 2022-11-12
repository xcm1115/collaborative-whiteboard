import Board from '@/views/Room/class/Board';
// import { getTextElementSize } from '@/utils';
import Text from '@/elements/Text';

// 文本编辑类
class TextEdit {
  private editable: any;
  private isEditing: boolean;
  private board: Board;

  constructor(own: Board) {
    this.board = own;
    this.editable = null;
    this.isEditing = false;
    this.onTextInput = this.onTextInput.bind(this);
    this.onTextBlur = this.onTextBlur.bind(this);
  }

  // 创建文本输入框元素
  crateTextInputEl() {
    this.editable = document.createElement('textarea');
    this.editable.dir = 'auto';
    this.editable.tabIndex = 0;
    this.editable.wrap = 'off';
    this.editable.className = 'textInput';
    const startX = this.board.elements.activeElement?.mouseDownY || 0 - this.board.width / 2;
    const startY = this.board.elements.activeElement?.mouseDownX || 0 - this.board.height / 2;
    Object.assign(this.editable.style, {
      position: 'absolute',
      top: `${startX}px`,
      left: `${startY}px`,
      display: 'block',
      minHeight: '1em',
      backfaceVisibility: 'hidden',
      margin: 0,
      padding: 0,
      border: '1px solid #000',
      outline: 0,
      resize: 'none',
      background: 'transparent',
      overflow: 'hidden',
      whiteSpace: 'pre',
    });
    this.editable.addEventListener('input', this.onTextInput);
    this.editable.addEventListener('blur', this.onTextBlur);
    document.body.appendChild(this.editable);
  }

  // 文本输入事件
  onTextInput() {
    // if (!this.board.elements.activeElement) return;
    const activeElement = this.board.elements.activeElement as Text;
    if (!activeElement) {
      return;
    }
    activeElement.text = this.editable.value;
    // const { width, height } = getTextElementSize(activeElement);
    activeElement.width = 100;
    activeElement.height = 200;
    // this.updateTextInputStyle();
  }

  // 文本框失焦事件
  onTextBlur() {
    this.board.elements.completeEditingText();
    this.board.elements.cancelActiveElement();
    this.board.render.render();
    this.editable.style.display = 'none';
    this.editable.value = '';
    this.isEditing = false;
  }

  // 显示文本编辑框
  showTextEdit() {
    if (!this.editable) {
      this.crateTextInputEl();
    } else {
      const startX = this.board.elements.activeElement?.mouseDownY || 0 - this.board.width / 2;
      const startY = this.board.elements.activeElement?.mouseDownX || 0 - this.board.height / 2;
      this.editable.style.display = 'block';
      this.editable.style.top = `${startX}px`;
      this.editable.style.left = `${startY}px`;
    }
    // this.updateTextInputStyle();
    this.editable.focus();
    this.editable.select();
    this.isEditing = true;
  }
}

export default TextEdit;
