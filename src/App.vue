<script setup lang="ts">
// Component
import { NConfigProvider, NMessageProvider } from 'naive-ui';
import Layout from '@/components/Layout/index.vue';

// Theme
import themeOverrides from '@/theme';

// Socket.IO
import '@/websocket/events';
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <n-message-provider>
      <Layout />
    </n-message-provider>
  </NConfigProvider>
</template>

<style scoped lang="scss"></style>
