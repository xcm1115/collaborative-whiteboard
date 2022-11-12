<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

// Store
import { mainStore } from '@/store';

// Component
import {
  NButton,
  NModal,
  NInput,
  NIcon,
  NAvatar,
  NTabs,
  NTabPane,
  NForm,
  NFormItemRow,
  useMessage,
  FormInst,
  NList,
  NListItem,
  NScrollbar,
} from 'naive-ui';
import { List24Regular as List } from '@vicons/fluent';

// API
import { login, register } from '@/api/auth';
import { getRoomList, createRoom } from '@/api/room';

// Type
import { State, LoginData, CreateRoomData, RoomListData } from './types';

const router = useRouter();

const store = mainStore();
const { userId, userName, userAvatar, token, roomId } = storeToRefs(store);

const message = useMessage();

const loginRules = {
  username: {
    required: true,
    message: 'Please input your username',
  },
  password: {
    required: true,
    message: 'Please input your password',
  },
};
const registerRules = {
  username: {
    required: true,
    message: 'Please input your username',
  },
  password: {
    required: true,
    message: 'Please input your password',
  },
  confirmPassword: {
    required: true,
    message: 'Please input your password',
  },
};

// Refs
const loginFormRef = ref<FormInst | null>(null);
const loginFormValue = ref({
  username: '',
  password: '',
});
const registerFormRef = ref<FormInst | null>(null);
const registerFormValue = ref({
  username: '',
  password: '',
  confirmPassword: '',
});
const tabValue = ref('login');
const inputValue = ref('');

const state: State = reactive({
  loginModalVisible: false,
  joinBoardVisible: false,
  inputValue: '',
  loading: false,
  roomList: [],
});

const handleGetRoomList = async () => {
  const postData = {
    token: token.value,
  };

  try {
    const res = await getRoomList(postData);
    const data: RoomListData = res.data as RoomListData;

    if (Number(res.code) === 0) {
      state.roomList = data.rooms;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning(`获取白板列表失败: ${error}`);
  }
};

const handleLoginModalVisible = (visible: boolean) => {
  state.loginModalVisible = visible;
};

const handleLogin = async (e: MouseEvent) => {
  e.preventDefault();
  loginFormRef.value?.validate();

  const postData = {
    username: loginFormValue.value.username,
    password: loginFormValue.value.password,
  };

  state.loading = true;

  try {
    const res = await login(postData);
    const data: LoginData = res.data as LoginData;

    if (Number(res.code) === 0) {
      userId.value = data.id;
      userName.value = loginFormValue.value.username;
      token.value = data.token;
      state.roomList = data.rooms;

      message.success('登录成功');
      handleLoginModalVisible(false);
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning(`登录失败: ${error}`);
  } finally {
    state.loading = false;
  }
};

const handleRegister = async (e: MouseEvent) => {
  e.preventDefault();
  registerFormRef.value?.validate();

  if (registerFormValue.value.password !== registerFormValue.value.confirmPassword) {
    message.warning('两次输入的密码不一致');
    return;
  }

  const postData = {
    username: registerFormValue.value.username,
    password: registerFormValue.value.password,
  };

  state.loading = true;

  try {
    const res = await register(postData);

    if (Number(res.code) === 0) {
      message.success('注册成功');
      tabValue.value = 'login';
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning(`注册失败: ${error}`);
  } finally {
    state.loading = false;
  }
};

const handleJoinRoomModalVisible = (visible: boolean) => {
  if (visible && !userId.value) {
    message.warning('您尚未登录，请先登录');
    state.loginModalVisible = true;
    return;
  }

  if (visible) {
    handleGetRoomList();
  }

  state.joinBoardVisible = visible;
};

const handleCreateRoom = async () => {
  if (!userId.value) {
    message.warning('您尚未登录，请先登录');
    state.loginModalVisible = true;
    return;
  }

  const postData = {
    token: token.value,
  };

  state.loading = true;

  try {
    const res = await createRoom(postData);
    const data: CreateRoomData = res.data as CreateRoomData;

    if (Number(res.code) === 0) {
      message.success('新建白板成功');
      roomId.value = data.roomId;
      router.push(`/room/${data.roomId}`);
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.warning(`新建白板失败: ${error}`);
  } finally {
    state.loading = false;
  }
};

const joinBoard = (id?: string) => {
  if (id) {
    roomId.value = id;
    router.push(`/room/${id}`);
  } else {
    router.push(`/room/${inputValue.value}`);
  }

  message.success('加入白板成功');
};
</script>

<template>
  <div class="cw-flex cw-justify-center">
    <div class="cw-w-[400px] cw-h-screen cw-flex cw-flex-col cw-justify-center">
      <div class="cw-flex cw-justify-between cw-items-center">
        <n-icon class="cw-text-primary-text cw-cursor-pointer" size="24">
          <List />
        </n-icon>

        <template v-if="userId">
          <n-avatar round size="large" :src="userAvatar" />
        </template>
        <template v-else>
          <n-button strong secondary type="primary" @click="handleLoginModalVisible(true)">
            登录
          </n-button>
        </template>
      </div>

      <img class="cw-w-full" src="@/assets/images/home.svg" alt="illustration" />

      <div class="cw-buttons">
        <n-button block size="large" @click="handleCreateRoom">新建白板</n-button>
        <n-button block type="primary" size="large" @click="handleJoinRoomModalVisible(true)"
          >加入白板</n-button
        >
      </div>
    </div>
  </div>

  <!-- 登录注册 Modal -->
  <n-modal
    :show="state.loginModalVisible"
    preset="dialog"
    :show-icon="false"
    :mask-closable="false"
    @close="handleLoginModalVisible(false)"
  >
    <n-tabs default-value="login" size="large" justify-content="space-evenly">
      <n-tab-pane name="login" tab="登录">
        <n-form ref="loginFormRef" :model="loginFormValue" :rules="loginRules">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="loginFormValue.username" size="large" />
          </n-form-item-row>
          <n-form-item-row label="密码" path="password">
            <n-input
              v-model:value="loginFormValue.password"
              size="large"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item-row>
        </n-form>
        <n-button
          size="large"
          type="primary"
          block
          secondary
          strong
          :loading="state.loading"
          @click="handleLogin"
        >
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form ref="registerFormRef" :model="registerFormValue" :rules="registerRules">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="registerFormValue.username" size="large" />
          </n-form-item-row>
          <n-form-item-row label="密码" path="password">
            <n-input
              v-model:value="registerFormValue.password"
              size="large"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item-row>
          <n-form-item-row label="重复密码" path="confirmPassword">
            <n-input
              v-model:value="registerFormValue.confirmPassword"
              size="large"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item-row>
        </n-form>
        <n-button
          size="large"
          type="primary"
          block
          secondary
          strong
          :loading="state.loading"
          @click="handleRegister"
        >
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-modal>

  <!-- 加入白板 Modal -->
  <n-modal
    :show="state.joinBoardVisible"
    title="加入白板"
    preset="dialog"
    :show-icon="false"
    :mask-closable="false"
    @close="handleJoinRoomModalVisible(false)"
  >
    <div class="cw-py-4 cw-flex cw-justify-between">
      <n-input
        v-model:value="inputValue"
        class="cw-mr-4"
        type="text"
        placeholder="输入白板 ID 或链接"
        size="large"
      />
      <n-button
        class="cw-join-board"
        type="primary"
        size="large"
        :loading="state.loading"
        @click="joinBoard()"
        >确定</n-button
      >
    </div>

    <n-scrollbar style="max-height: 350px" trigger="hover">
      <n-list bordered clickable>
        <template #header>
          <div class="cw-flex cw-justify-center">已创建的白板</div>
        </template>
        <n-list-item v-for="roomId in state.roomList" :key="roomId" @click="joinBoard(roomId)">{{
          roomId
        }}</n-list-item>
      </n-list>
    </n-scrollbar>
  </n-modal>
</template>

<style scoped lang="scss">
.cw-buttons {
  @apply cw-flex cw-flex-col cw-w-full cw-items-center;
  :deep(.n-button) {
    @apply cw-mb-4;
  }
}
</style>
