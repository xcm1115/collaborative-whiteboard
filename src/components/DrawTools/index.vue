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
import { ElementType } from '@/elements';

const emits = defineEmits<{
  (e: 'changeDrawTool', value: string): void;
}>();

const selectArrowUpLeft = () => {
  emits('changeDrawTool', ElementType.Arrow);
};

const selectRectangle = () => {
  emits('changeDrawTool', ElementType.Rectangle);
};

const selectTriangle = () => {
  emits('changeDrawTool', ElementType.Triangle);
};

const selectCircle = () => {
  emits('changeDrawTool', ElementType.Circle);
};

const selectSmoothLine = () => {
  emits('changeDrawTool', ElementType.SmoothLine);
};

const selectStraightLine = () => {
  emits('changeDrawTool', ElementType.StraightLine);
};

const selectDiamond = () => {
  emits('changeDrawTool', ElementType.Diamond);
};

const selectText = () => {
  emits('changeDrawTool', ElementType.Text);
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

      <n-button size="large" quaternary @click="selectSmoothLine">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <SmoothLine />
          </n-icon>
        </template>
      </n-button>

      <n-button size="large" quaternary @click="selectStraightLine">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <StraightLine />
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

      <n-button size="large" quaternary @click="selectDiamond">
        <template #icon>
          <n-icon size="24" color="#ffffff">
            <Diamond />
          </n-icon>
        </template>
      </n-button>

      <n-button size="large" quaternary @click="selectText">
        <template #icon>
          <n-icon size="24" color="#ffffff">
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
