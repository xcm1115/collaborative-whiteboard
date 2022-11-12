import Board from './Board';

const importFromJson = (board: Board) => {
  const element = document.createElement('input');

  element.type = 'file';
  element.accept = 'application/json';

  element.addEventListener('input', () => {
    const reader = new FileReader();

    reader.onload = () => {
      element.value = '';

      if (reader.result) {
        board.setData(JSON.parse(reader.result as string));
      }
    };

    reader.readAsText(element.files![0]);
  });

  element.click();
};

export { importFromJson };
