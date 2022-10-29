<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Board from './class/Board';

const container = ref<HTMLDivElement | null>(null);

const init = () => {
  const board = new Board({ container: container.value! });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="cw-fixed cw-left-0 cw-top-0 cw-w-full cw-h-full">
    <div
      ref="container"
      class="cw-canvas cw-absolute cw-left-1/2 cw-top-1/2 cw-w-full cw-h-full"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.cw-canvas {
  transform: translate(-50%, -50%);
}
</style>
