<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ws from '@/websocket/events';
import DrawTools from '../../components/DrawTools/index.vue';

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
} from 'naive-ui';
import {
  ArrowLeft24Regular as ArrowLeft,
  Share24Filled as Share,
  Edit24Filled as Edit,
  Checkmark24Regular as Checkmark,
  PeopleSettings24Filled as PeopleSettings,
  BorderAll16Filled,
} from '@vicons/fluent';

// Type
import { State } from './types';

// Class
import Board from './class/Board';

const router = useRouter();

const container = ref<HTMLDivElement | null>(null);
const boardName = ref<string>('新建白板');
const boardMode = ref<string>('read-only');

let board: any = null;

const state: State = reactive({
  isEditingBoardName: false,
});

const init = () => {
  board = new Board({ container: container.value! });
};

const backToHome = () => {
  router.push({
    name: 'home',
  });
};

onMounted(() => {
  init();

  ws.addEventListener('message', async (event) => {
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
});

onUnmounted(() => {
  // ws.close();
});

const curDrawTool = (drawTool: string) => {
  board.setDrawType(drawTool);
};
</script>

<template>
  <div
    class="cw-w-full cw-fixed cw-top-0 cw-left-0 cw-z-50 cw-flex cw-justify-between cw-items-center cw-px-6 cw-py-4 cw-border-b cw-bg-white"
  >
    <span class="cw-flex cw-items-center">
      <n-button size="large" @click="backToHome">
        <template #icon>
          <n-icon>
            <ArrowLeft />
          </n-icon>
        </template>
      </n-button>

      <span
        v-if="!state.isEditingBoardName"
        class="cw-flex cw-items-center cw-ml-4 cw-text-lg cw-font-semibold"
      >
        <span class="cw-mr-3">{{ boardName }}</span>
        <n-icon
          class="cw-cursor-pointer"
          size="14"
          @click="() => (state.isEditingBoardName = true)"
        >
          <Edit />
        </n-icon>
      </span>

      <n-input-group v-else>
        <n-input
          v-model:value="boardName"
          class="cw-ml-4"
          size="large"
          placeholder="请输入白板名称"
        />
        <n-button size="large" @click="() => (state.isEditingBoardName = false)">
          <n-icon>
            <Checkmark />
          </n-icon>
        </n-button>
      </n-input-group>
    </span>

    <span class="cw-flex cw-items-center">
      <span class="cw-mr-8">
        <n-popover trigger="click">
          <template #trigger>
            <n-button size="large">
              <template #icon>
                <n-icon>
                  <PeopleSettings />
                </n-icon>
              </template>
            </n-button>
          </template>

          <n-radio-group v-model:value="boardMode" name="radiogroup">
            <div class="cw-flex cw-flex-col">
              <n-space vertical>
                <n-radio value="collaboration"> 协作模式 </n-radio>
                <n-radio value="read-only"> 只读模式 </n-radio>
              </n-space>
            </div>
          </n-radio-group>
        </n-popover>
      </span>

      <n-button type="primary" size="large" icon-placement="right">
        <template #icon>
          <n-icon>
            <Share />
          </n-icon>
        </template>
        分享
      </n-button>
    </span>
  </div>

  <div class="draw-tools-panel cw-fixed cw-top-20 cw-left-10 cw-z-50 cw-px-6 cw-py-4 cw-bg-white">
    <DrawTools @change-draw-tool="curDrawTool" />
  </div>

  <div class="cw-fixed cw-top-0 cw-left-0 cw-w-full cw-h-full">
    <div
      ref="container"
      class="cw-canvas cw-absolute cw-left-1/2 cw-top-1/2 cw-w-full cw-h-full cw-bg-board"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.cw-canvas {
  transform: translate(-50%, -50%);
}
.draw-tools-panel {
  border-radius: 20%;
}
</style>
