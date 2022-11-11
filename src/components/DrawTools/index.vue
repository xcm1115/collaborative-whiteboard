<script setup lang="ts">
// Component
import { NButton, NIcon, NSpace } from 'naive-ui';
import {
  RectangleLandscape24Regular as Rectangle,
  ArrowUpLeft24Regular as ArrowUpLeft,
  Triangle32Regular as Triangle,
  Circle32Regular as Circle,
  Line32Filled as StraightLine,
  Diamond32Regular as Diamond,
  TextT28Filled as Text,
} from '@vicons/fluent';
import { Carbon3DCurveAutoColon as SmoothLine } from '@vicons/carbon';

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

const selectSmoothLine = () => {
  emits('changeDrawTool', 'SmoothLine');
};

const selectStraightLine = () => {
  emits('changeDrawTool', 'StraightLine');
};

const selectDiamond = () => {
  emits('changeDrawTool', 'Diamond');
};

const selectText = () => {
  emits('changeDrawTool', 'Text');
};
</script>

<template>
  <div
    class="cw-draw-tools cw-fixed cw-top-1/2 cw-left-[20px] cw-bg-primary-black cw-rounded cw-py-2"
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

      <n-button size="small" @click="selectDiamond">
        <template #icon>
          <n-icon>
            <Diamond />
          </n-icon>
        </template>
      </n-button>

      <n-button size="small" @click="selectText">
        <template #icon>
          <n-icon>
            <Text />
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
