<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { nanoid } from 'nanoid/async';

// Component
import { NButton, NModal, NInput } from 'naive-ui';

// Type
import { State } from './types';

const router = useRouter();

const state: State = reactive({
  joinBoardVisible: false,
  inputValue: '',
  loading: false,
});

const handleModalVisible = (visible: boolean) => {
  state.joinBoardVisible = visible;
};

const inputChange = (value: string) => {
  state.inputValue = value;
};

const createBoard = async () => {
  state.loading = true;
  const boardId = await nanoid(import.meta.env.VITE_NANOID_LENGTH);
  state.loading = false;

  router.push({
    name: 'board',
    params: {
      id: boardId,
    },
  });
};

const joinBoard = () => {
  state.loading = true;
  setTimeout(() => {
    state.loading = false;
    state.joinBoardVisible = false;
  }, 1000);
};
</script>

<template>
  <div class="cw-flex cw-flex-col cw-items-center">
    <img class="cw-w-1/5 cw-mt-[150px]" src="@/assets/images/home.svg" alt="illustration" />

    <div class="cw-buttons">
      <n-button size="large" @click="createBoard">新建白板</n-button>
      <n-button class="cw-join-board" type="primary" size="large" @click="handleModalVisible(true)"
        >加入白板</n-button
      >
    </div>
  </div>

  <n-modal
    :show="state.joinBoardVisible"
    title="加入白板"
    preset="dialog"
    positive-text="加入"
    negative-text="取消"
    :show-icon="false"
    :mask-closable="false"
    @close="handleModalVisible(false)"
  >
    <div class="cw-py-4">
      <n-input
        v-model:value="state.inputValue"
        type="text"
        placeholder="输入白板 ID 或链接"
        size="large"
        @change="inputChange"
      />
    </div>

    <template #action>
      <n-button size="large" @click="handleModalVisible(false)">取消</n-button>
      <n-button
        class="cw-join-board"
        type="primary"
        size="large"
        :loading="state.loading"
        @click="joinBoard"
        >确定</n-button
      >
    </template>
  </n-modal>
</template>

<style scoped lang="scss">
.cw-buttons {
  @apply cw-flex cw-flex-col cw-w-full cw-items-center;
  :deep(.n-button) {
    @apply cw-w-1/5 cw-mb-4;
  }
}
</style>
