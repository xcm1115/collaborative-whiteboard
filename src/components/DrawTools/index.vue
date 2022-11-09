<script setup lang="ts">
// Component
import { NButton, NIcon } from 'naive-ui';
import {
  RectangleLandscape28Regular as Rectangle,
  ArrowUpLeft24Filled as ArrowUpLeft,
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
  <div class="draw-tools-container">
    <span class="cw-items-center">
      <n-space vertical>
        <n-button size="small" @click="selectArrowUpLeft">
          <template #icon>
            <n-icon>
              <ArrowUpLeft />
            </n-icon>
          </template>
        </n-button>

        <n-button size="small" @click="selectRectangle">
          <template #icon>
            <n-icon>
              <Rectangle />
            </n-icon>
          </template>
        </n-button>

        <n-button size="small" @click="selectTriangle">
          <template #icon>
            <n-icon>
              <Triangle />
            </n-icon>
          </template>
        </n-button>

        <n-button size="small" @click="selectCircle">
          <template #icon>
            <n-icon>
              <Circle />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </span>
  </div>
</template>

<style scoped lang="scss">
.draw-tools-container {
  width: 40px;
  border-radius: 20%;
  // background-color: blue;
}
</style>
