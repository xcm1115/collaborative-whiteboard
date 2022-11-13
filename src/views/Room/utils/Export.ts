import Board from '../class/Board';

type Json = {
  boardId: number;
  elements: any;
};

const exportJson = (boards: Board[]) => {
  const json: Json[] = [];

  boards.forEach((board) => {
    const data = board.getData();
    json.push(data);
  });

  return json;
};

const downloadJson = (json: Json[]) => {
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(json)], { type: 'application/json' });

  element.href = URL.createObjectURL(file);
  element.download = 'export.json';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export { exportJson, downloadJson };
