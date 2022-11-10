<script setup lang="ts">
// Component
import { NButton, NIcon, NSpace } from 'naive-ui';
import {
  RectangleLandscape24Regular as Rectangle,
  ArrowUpLeft24Regular as ArrowUpLeft,
  Triangle32Regular as Triangle,
  Circle32Regular as Circle,
} from '@vicons/fluent';

const emits = defineEmits<{
  (e: 'changeDrawTool', value: string): void;
}>();

const selectArrowUpLeft = () => {
  emits('changeDrawTool', 'Arrow');
};

const selectRectangle = () => {
  emits('changeDrawTool', 'Rectangle');
};

const selectTriangle = () => {
  emits('changeDrawTool', 'Triangle');
};

const selectCircle = () => {
  emits('changeDrawTool', 'Circle');
};
</script>

<template>
  <div
    class="cw-draw-tools cw-fixed cw-top-1/2 cw-left-[20px] cw-bg-primary-black cw-rounded cw-p-2"
  >
    <n-space vertical>
      <n-button size="large" quaternary @click="selectArrowUpLeft">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <ArrowUpLeft />
          </n-icon>
        </template>
      </n-button>

      <n-button size="large" quaternary @click="selectRectangle">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <Rectangle />
          </n-icon>
        </template>
      </n-button>

      <n-button size="large" quaternary @click="selectTriangle">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <Triangle />
          </n-icon>
        </template>
      </n-button>

      <n-button size="large" quaternary @click="selectCircle">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <Circle />
          </n-icon>
        </template>
      </n-button>
    </n-space>
  </div>
</template>

<style scoped lang="scss">
.cw-draw-tools {
  transform: translateY(-50%);
}
</style>
