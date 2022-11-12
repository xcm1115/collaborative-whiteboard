import Board from './Board';

const exportJson = (board: Board) => {
  const json = board.getData();
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(json)], { type: 'application/json' });

  element.href = URL.createObjectURL(file);
  element.download = 'export.json';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export { exportJson };
