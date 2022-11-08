<script setup lang="ts">
// Component
import { NLayout, NLayoutContent } from 'naive-ui';
</script>

<template>
  <n-layout class="cw-flex cw-flex-col cw-h-screen">
    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="scss"></style>
