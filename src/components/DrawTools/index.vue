<script setup lang="ts">
// Component
import { NButton, NIcon } from 'naive-ui';
import {
  RectangleLandscape28Regular as Rectangle,
  ArrowUpLeft24Filled as ArrowUpLeft,
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
  <div class="draw-tools-container">
    <span class="cw-items-center">
      <n-button size="small" @click="selectArrowUpLeft">
        <template #icon>
          <n-icon>
            <ArrowUpLeft />
          </n-icon>
        </template>
      </n-button>

      <n-button size="small" @click="selectSmoothLine">
        <template #icon>
          <n-icon>
            <SmoothLine />
          </n-icon>
        </template>
      </n-button>

      <n-button size="small" @click="selectStraightLine">
        <template #icon>
          <n-icon>
            <StraightLine />
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
    </span>
  </div>
</template>

<style scoped lang="scss">
.draw-tools-container {
  width: 40px;
  border-radius: 20%;
}
</style>
