<script setup lang="ts">
import { reactive, ref, Ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useClipboard } from '@vueuse/core';
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
  NRadioGroup,
  NRadioButton,
  NAvatarGroup,
  NDropdown,
  useMessage,
  NTooltip,
} from 'naive-ui';
import {
  ArrowLeft24Regular as ArrowLeft,
  Share24Filled as Share,
  Edit24Filled as Edit,
  Checkmark24Regular as Checkmark,
  Add24Regular as Add,
  MoreHorizontal24Regular as MoreHorizontal,
} from '@vicons/fluent';
import DrawTools from '@/components/DrawTools/index.vue';
import { ElementType } from '@/elements';

// API
import { checkRoomExist, checkIsOwner } from '@/api/room';

// Type
import { Message } from '@/websocket/types';
import { RoomExistData, User, State, CheckIsOwnerData } from './types';

// Class
import Board from './class/Board';
import { drawElement } from './class/Draw';

// Util
import { importFromJson } from './utils/import';
import { exportJson, downloadJson } from './utils/Export';
import { exportSync } from './utils/sync';

const store = mainStore();
const { userId, token, userName, userAvatar, ws, roomId } = storeToRefs(store);

const router = useRouter();
const message = useMessage();
const { copy, copied } = useClipboard();

const userList = ref<User[]>([]);
const container = ref<HTMLDivElement | null>(null);
const roomName = ref<string>('新建白板');
const roomMode = ref<string>('cooperation');
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
  isFounder: true,
  isEditingBoardName: false,
});

const modeOptions = [
  {
    label: '协作模式',
    key: 'cooperation',
  },
  {
    label: '阅读模式',
    key: 'read',
  },
];
const moreOptions = [
  {
    label: '从 JSON 导入',
    key: 'import',
  },
  {
    label: '导出 JSON',
    key: 'json',
  },
];

const handleCheckRoomExist = async () => {
  let isExist = false;
  const postData = {
    token: token.value,
    roomId: roomId.value,
  };

  try {
    const res = await checkRoomExist(postData);
    const data: RoomExistData = res.data as RoomExistData;

    if (Number(res.code) === 0) {
      if (data.exist === 1) {
        isExist = true;
        return isExist;
      } else {
        message.warning('房间不存在');
      }
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning(`请求错误: ${error}`);
  }

  return isExist;
};

const init = async () => {
  if (!ws.value && userId.value) {
    userList.value.push({
      userId: userId.value,
      userName: userName.value,
      src: userAvatar.value,
    });

    ws.value = new WS();
    ws.value.createWebSocket(roomId.value, userId.value);

    const board = new Board({ boardId: 0, container: container.value! });

    boards.value.push(board);
    currentBoard.value = board;
  }
};

const handleCheckIsOwner = async () => {
  const postData = {
    token: token.value,
    roomId: roomId.value,
  };

  try {
    const res = await checkIsOwner(postData);
    const data = res.data as CheckIsOwnerData;

    if (Number(res.code) === 0) {
      if (data.isOwner) {
        state.isFounder = true;
      } else {
        state.isFounder = false;
      }
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning('获取房间信息失败');
  }
};

const wsOnOpen = () => {
  if (ws.value) {
    ws.value.instance?.addEventListener('open', () => {
      const msg: Message = {
        userId: userId.value!,
        roomId: roomId.value!,
        operation: 'join',
        data: {
          userName: userName.value!,
          userAvatar: userAvatar.value,
        },
      };
      ws.value!.instance?.send(JSON.stringify(msg));
    });
  }
};

const wsOnMessage = () => {
  if (ws.value) {
    ws.value!.instance?.addEventListener('message', async (event) => {
      const msg = await JSON.parse(event.data);

      if (msg.userId && msg.userId === userId.value) {
        switch (msg.operation) {
          case 'export':
            exportSync(boards.value as Board[]);
            break;
          case 'full-frame':
            break;
        }
      }

      if (msg.userId && msg.userId !== userId.value) {
        switch (msg.operation) {
          case 'join':
            userList.value.push({
              userId: msg.userId,
              userName: msg.data.userName,
              src: msg.data.userAvatar,
            });
            break;
          case 'leave':
            userList.value = userList.value.filter((user) => user.userId !== msg.userId);
            break;
          case 'switch-mode':
            roomMode.value = msg.data.mode;
            break;
          case 'draw':
            drawElement({
              board: currentBoard.value as Board,
              type: msg.data.type,
              mouseDownX: msg.data.mouseDownX,
              mouseDownY: msg.data.mouseDownY,
              width: msg.data.width,
              height: msg.data.height,
              clientX: msg.data.clientX,
              clientY: msg.data.clientY,
              isSync: false,
            });
            break;
          case 'mouseup':
            currentBoard.value!.isMouseDown = false;
            currentBoard.value!.mouseDownX = 0;
            currentBoard.value!.mouseDownY = 0;
            currentBoard.value!.elements.cancelActiveElement();
            break;
          case 'add-board':
            addTab(msg.data.boardId, false);
            break;
          case 'switch-board':
            switchTab(msg.data.boardId, false);
            break;
          default:
            break;
        }
      }
    });
  }
};

const backToHome = () => {
  router.push({
    name: 'home',
  });
};

const handleModeSelect = (key: string) => {
  roomMode.value = key;

  switch (key) {
    case 'cooperation':
      currentBoard.value!.setDrawType(ElementType.Arrow);
      break;
    case 'read':
      currentBoard.value!.elements.cancelActiveElement();
      currentBoard.value!.setDrawType(ElementType.Arrow);
      break;
    default:
      break;
  }

  const data = {
    mode: key,
  };

  ws.value!.sendWsMsg(userId.value!, roomId.value!, 'switch-mode', data);
};

const share = () => {
  copy(roomId.value!);

  if (copied) {
    message.success('白板 ID 已复制');
  }
};

const handleMoreSelect = (key: string) => {
  if (currentBoard.value) {
    switch (key) {
      case 'import':
        importFromJson(
          container,
          boards as Ref<Board[]>,
          currentBoard as Ref<Board | null>,
          tabsRef,
          currentTab
        );
        break;
      case 'json':
        downloadJson(exportJson(boards.value as Board[]));
        break;
      default:
        break;
    }
  }
};

const curDrawTool = (drawTool: string) => {
  if (roomMode.value === 'read') {
    return;
  }

  if (currentBoard.value) {
    currentBoard.value.setDrawType(drawTool as ElementType);
  }
};

const addTab = (boardId: number, isSync = false) => {
  container.value!.innerHTML = '';
  const board = new Board({ boardId, container: container.value! });

  boards.value.push(board);
  tabsRef.value.push({
    value: `白板 ${boardId + 1}`,
    label: `白板 ${boardId + 1}`,
  });
  currentBoard.value = board;
  currentTab.value = boardId;

  if (isSync) {
    const data = {
      boardId,
    };

    ws.value!.sendWsMsg(userId.value!, roomId.value!, 'add-board', data);
  }
};

const switchTab = (index: number, isSync = false) => {
  currentBoard.value = boards.value[index];
  container.value!.innerHTML = '';
  currentBoard.value!.initBoard();
  currentBoard.value!.render.render();
  currentTab.value = index;

  if (state.isFounder && roomMode.value === 'read' && isSync) {
    const data = {
      boardId: index,
    };

    ws.value?.sendWsMsg(userId.value!, roomId.value!, 'switch-board', data);
  }
};

onMounted(async () => {
  if (!userId.value) {
    backToHome();
    return;
  }

  const isExist = await handleCheckRoomExist();
  if (!isExist) {
    backToHome();
    return;
  }

  await init();
  await handleCheckIsOwner();

  wsOnOpen();
  wsOnMessage();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value!.sendWsMsg(userId.value!, roomId.value!, 'leave', null);
    ws.value!.closeWebSocket();
    ws.value = null;
  }
});
</script>

<template>
  <!-- TODO: 拆分组件 -->
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
        <n-dropdown
          v-if="state.isFounder"
          trigger="hover"
          :options="modeOptions"
          @select="handleModeSelect"
        >
          <n-button>{{ roomMode === 'cooperation' ? '协作模式' : '阅读模式' }} </n-button>
        </n-dropdown>

        <n-tooltip v-else trigger="hover">
          <template #trigger>
            <n-button disabled
              >{{ roomMode === 'cooperation' ? '协作模式' : '阅读模式' }}
            </n-button>
          </template>
          非创建者无法修改模式
        </n-tooltip>
      </span>

      <n-button type="primary" icon-placement="right" @click="share">
        <template #icon>
          <n-icon>
            <Share />
          </n-icon>
        </template>
        分享
      </n-button>

      <span class="cw-mx-4">
        <n-dropdown trigger="hover" :options="moreOptions" @select="handleMoreSelect">
          <n-button quaternary>
            <n-icon size="24">
              <MoreHorizontal />
            </n-icon>
          </n-button>
        </n-dropdown>
      </span>

      <n-avatar-group :options="userList" :size="40" :max="3" />
    </span>
  </div>

  <div class="cw-fixed cw-top-0 cw-left-0 cw-w-full cw-h-full">
    <div
      ref="container"
      class="cw-canvas cw-absolute cw-left-1/2 cw-top-1/2 cw-w-full cw-h-full cw-bg-board"
    ></div>
  </div>

  <DrawTools v-if="roomMode === 'cooperation'" @change-draw-tool="curDrawTool" />

  <!-- TODO: 拆分组件 -->
  <span class="cw-tabs cw-fixed cw-top-[110px] cw-flex cw-items-center">
    <n-radio-group
      v-model:value="currentTab"
      class="cw-mr-2"
      size="large"
      @update:value="switchTab(currentTab, true)"
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

    <n-button class="cw-add-tab" size="large" @click="addTab(boards.length, true)">
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
