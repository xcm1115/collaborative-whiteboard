<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
// import { DrawOptions } from './types';
import WS from '@/websocket';

import { storeToRefs } from 'pinia';

// Store
import { mainStore } from '@/store';

// Component
import {
  NButton,
  NIcon,
  NInputGroup,
  NInput,
  NPopover,
  NRadioGroup,
  NRadio,
  NSpace,
  NRadioButton,
} from 'naive-ui';
import {
  ArrowLeft24Regular as ArrowLeft,
  Share24Filled as Share,
  Edit24Filled as Edit,
  Checkmark24Regular as Checkmark,
  PeopleSettings24Filled as PeopleSettings,
  Add24Regular as Add,
  Subtract24Regular as Subtract,
} from '@vicons/fluent';
import DrawTools from '@/components/DrawTools/index.vue';

// Draw
import { drawRectangle } from './class/Draw';

// Type
import { Message } from '@/websocket/types';
import { State } from './types';

// Class
import Board from './class/Board';

const store = mainStore();
const { userId, ws, roomId } = storeToRefs(store);

const router = useRouter();

const container = ref<HTMLDivElement | null>(null);
const roomName = ref<string>('新建白板');
const roomMode = ref<string>('read-only');
const tabsRef = ref([
  {
    value: '白板 1',
    label: '白板 1',
  },
]);
const currentTab = ref(0);
const boards = ref<Board[]>([]);
const currentBoard = ref<Board | null>(null);

const state: State = reactive({
  isEditingBoardName: false,
});

const init = async () => {
  if (!ws.value && userId.value) {
    ws.value = new WS();
    ws.value.createWebSocket(roomId.value, userId.value);

    const board = new Board({ boardId: 0, container: container.value! });

    boards.value.push(board);
    currentBoard.value = board;
  }
};

const wsOnOpen = () => {
  ws.value!.instance?.addEventListener('open', () => {
    const msg: Message = {
      userId: userId.value!,
      roomId: roomId.value!,
      operation: 'join',
      data: null,
    };
    ws.value!.instance?.send(JSON.stringify(msg));
  });
};

const wsOnMessage = () => {
  ws.value!.instance?.addEventListener('message', async (event) => {
    const msg = await JSON.parse(event.data);
    const options = {
      board: currentBoard.value as Board,
      mouseDownX: msg.data.mouseDownX,
      mouseDownY: msg.data.mouseDownY,
      width: msg.data.width,
      height: msg.data.height,
      isSync: false,
    };

    if (msg.userId && msg.userId !== userId.value) {
      switch (msg.operation) {
        case 'join':
          break;
        case 'draw':
          drawRectangle(options);
          break;
        case 'mouseup':
          currentBoard.value!.onMouseup();
          break;
        case 'leave':
          break;
        default:
          break;
      }
    }
  });
};

const backToHome = () => {
  router.push({
    name: 'home',
  });
};

const curDrawTool = (drawTool: string) => {
  currentBoard.value!.setDrawType(drawTool);
};

const addTab = () => {
  container.value!.innerHTML = '';
  const board = new Board({ boardId: boards.value.length + 1, container: container.value! });

  boards.value.push(board);
  tabsRef.value.push({
    value: `白板 ${tabsRef.value.length + 1}`,
    label: `白板 ${tabsRef.value.length + 1}`,
  });
  currentBoard.value = board;
  currentTab.value = tabsRef.value.length - 1;

  const data = {
    boardId: board.boardId,
  };
  ws.value?.sendWsMsg(userId.value!, roomId.value!, 'add-board', data);
};

const switchTab = (index: number) => {
  currentBoard.value = boards.value[index];
  container.value!.innerHTML = '';
  currentBoard.value!.initBoard();
  currentBoard.value!.render.render();

  const data = {
    boardId: index,
  };
  ws.value!.sendWsMsg(userId.value!, roomId.value!, 'switch-board', data);
};

onMounted(async () => {
  if (!userId.value) {
    router.push({
      name: 'home',
    });
  }

  await init();

  wsOnOpen();
  wsOnMessage();
});

onUnmounted(() => {
  ws.value!.sendWsMsg(userId.value!, roomId.value!, 'leave', null);
  ws.value!.closeWebSocket();
});
</script>

<template>
  <div
    class="cw-w-full cw-fixed cw-top-0 cw-left-0 cw-z-50 cw-flex cw-justify-between cw-items-center cw-px-6 cw-py-4 cw-border-b cw-bg-white"
  >
    <span class="cw-flex cw-items-center">
      <n-button @click="backToHome">
        <template #icon>
          <n-icon>
            <ArrowLeft />
          </n-icon>
        </template>
      </n-button>

      <span
        v-if="!state.isEditingBoardName"
        class="cw-flex cw-items-center cw-ml-6 cw-text-lg cw-font-semibold"
      >
        <span class="cw-mr-3">{{ roomName }}</span>
        <n-icon
          class="cw-cursor-pointer"
          size="14"
          @click="() => (state.isEditingBoardName = true)"
        >
          <Edit />
        </n-icon>
      </span>

      <n-input-group v-else>
        <n-input v-model:value="roomName" class="cw-ml-4" placeholder="请输入白板名称" />
        <n-button @click="() => (state.isEditingBoardName = false)">
          <n-icon>
            <Checkmark />
          </n-icon>
        </n-button>
      </n-input-group>
    </span>

    <span class="cw-flex cw-items-center">
      <span class="cw-mr-6">
        <n-popover trigger="click">
          <template #trigger>
            <n-button>
              <template #icon>
                <n-icon>
                  <PeopleSettings />
                </n-icon>
              </template>
            </n-button>
          </template>

          <n-radio-group v-model:value="roomMode" name="radiogroup">
            <div class="cw-flex cw-flex-col">
              <n-space vertical>
                <n-radio value="collaboration"> 协作模式 </n-radio>
                <n-radio value="read-only"> 只读模式 </n-radio>
              </n-space>
            </div>
          </n-radio-group>
        </n-popover>
      </span>

      <n-button type="primary" icon-placement="right">
        <template #icon>
          <n-icon>
            <Share />
          </n-icon>
        </template>
        分享
      </n-button>
    </span>
  </div>

  <div class="cw-fixed cw-top-0 cw-left-0 cw-w-full cw-h-full">
    <div
      ref="container"
      class="cw-canvas cw-absolute cw-left-1/2 cw-top-1/2 cw-w-full cw-h-full cw-bg-board"
    ></div>
  </div>

  <DrawTools @change-draw-tool="curDrawTool" />

  <!-- TODO: 拆成组件 -->
  <span class="cw-tabs cw-fixed cw-bottom-[20px] cw-flex cw-items-center">
    <n-radio-group
      v-model:value="currentTab"
      class="cw-mr-2"
      size="large"
      @update:value="switchTab"
    >
      <n-radio-button v-for="(tab, index) in tabsRef" :key="tab.value" :value="index">
        <div class="cw-flex cw-items-center">
          <!-- <span class="cw-mr-2"> -->
          {{ tab.label }}
          <!-- </span> -->

          <!-- <n-icon>
            <Subtract />
          </n-icon> -->
        </div>
      </n-radio-button>
    </n-radio-group>

    <n-button class="cw-add-tab" size="large" @click="addTab">
      <template #icon>
        <n-icon>
          <Add />
        </n-icon>
      </template>
    </n-button>
  </span>
</template>

<style scoped lang="scss">
.cw-canvas {
  transform: translate(-50%, -50%);
}

.cw-tabs {
  left: 50%;
  transform: translate(-50%, -50%);
}

.cw-add-tab {
  @apply cw-px-[10px];
}
</style>
