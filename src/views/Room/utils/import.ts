import Board from '../class/Board';
import { Ref } from 'vue';

type Tab = {
  label: string;
  value: string;
};

type Item = {
  boardId: number;
  elements: any;
};

const importFromJson = (
  container: Ref<HTMLDivElement | null>,
  boards: Ref<Board[]>,
  currentBoard: Ref<Board | null>,
  tabs: Ref<Tab[]>,
  currentTab: Ref<number>
) => {
  const element = document.createElement('input');

  element.type = 'file';
  element.accept = 'application/json';

  element.addEventListener('input', () => {
    const reader = new FileReader();

    reader.onload = () => {
      element.value = '';

      if (reader.result) {
        const data = JSON.parse(reader.result as string);

        boards.value = [];
        tabs.value = [];

        data.forEach((item: Item) => {
          const board = new Board({ boardId: item.boardId, container: container.value! });

          board.setData(item);
          boards.value.push(board);
          tabs.value.push({
            value: `白板 ${item.boardId + 1}`,
            label: `白板 ${item.boardId + 1}`,
          });
          currentTab.value = 0;
        });

        currentBoard.value = boards.value[0];
        container.value!.innerHTML = '';
        currentBoard.value!.initBoard();
        currentBoard.value!.render.render();
      }
    };

    reader.readAsText(element.files![0]);
  });

  element.click();
};

export { importFromJson };
