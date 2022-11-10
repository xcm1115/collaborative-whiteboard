<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import createWebSocket from '@/websocket';

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

// Type
import { State } from './types';

// Class
import Board from './class/Board';

const store = mainStore();
const { userId, ws } = storeToRefs(store);

const router = useRouter();
const route = useRoute();

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

const roomId = route.params.id as string;
let board: any = null;

const state: State = reactive({
  isEditingBoardName: false,
});

const init = async () => {
  if (!ws.value && userId.value) {
    ws.value = await createWebSocket(roomId, userId.value);
    board = new Board({ container: container.value! });
    boards.value.push(board);
    currentBoard.value = board;
  }
};

const backToHome = () => {
  router.push({
    name: 'home',
  });
};

const addTab = () => {
  container.value!.innerHTML = '';
  const board = new Board({ container: container.value! });

  boards.value.push(board);
  tabsRef.value.push({
    value: `白板 ${tabsRef.value.length + 1}`,
    label: `白板 ${tabsRef.value.length + 1}`,
  });
  currentBoard.value = board;
  currentTab.value = tabsRef.value.length - 1;
};

watch(
  () => currentTab.value,
  (val) => {
    currentBoard.value = boards.value[val];
    container.value!.innerHTML = '';
    currentBoard.value!.initBoard();
    currentBoard.value!.render.render();
  }
);

onMounted(() => {
  init();

  if (ws.value) {
    ws.value.addEventListener('message', async (event) => {
      const data = await event.data.text();

      data.split('\n').forEach((msg: any) => {
        msg = JSON.parse(msg);

        if (msg.userId && msg.userId !== board.userId) {
          if (msg.operation === 'draw') {
            board.elements.createRectangle(
              msg.userId,
              msg.data.mouseDownX,
              msg.data.mouseDownY,
              msg.data.width,
              msg.data.height
            );
            board.render.render();

            // board.render.clearBoard();
            // board.ctx.beginPath();
            // board.ctx.rect(
            //   msg.data.mouseDownX - board.board.width / 2,
            //   msg.data.mouseDownY - board.board.height / 2,
            //   msg.data.width,
            //   msg.data.height
            // );
            // board.ctx.stroke();
          }

          if (msg.operation === 'mouseup') {
            board.isMouseDown = false;
            board.mouseDownX = 0;
            board.mouseDownY = 0;
            board.elements.cancelActiveElement();
          }
        }
      });
    });
  }
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
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

  <span class="cw-tabs cw-fixed cw-bottom-[20px] cw-flex cw-items-center">
    <n-radio-group v-model:value="currentTab" class="cw-mr-2" size="large">
      <n-radio-button v-for="(board, index) in tabsRef" :key="board.value" :value="index">
        <div class="cw-flex cw-items-center">
          <!-- <span class="cw-mr-2"> -->
          {{ board.label }}
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
