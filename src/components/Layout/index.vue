<script setup lang="ts">
import Header from './Header/index.vue';
</script>

<template>
  <a-layout>
    <Header />

    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="scss"></style>
