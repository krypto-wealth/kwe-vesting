<template>
  <div>
    <NavHeader />
    <main class="main content-body">
      <slot />
    </main>
    <NavFooter />
  </div>
</template>

<script setup lang="ts">
import NavHeader from '@/components/nav/Header.vue'
import NavFooter from '@/components/nav/Footer.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';

.main {
  @include flex(column, flex-start, center);
}

.content-body {
  min-height: calc(100vh - 220px);
}
</style>
