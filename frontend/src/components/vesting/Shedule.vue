<template>
  <div class="w-full">
    <div class="flex h-[44px] justify-between items-center list-header">
      <div>Date</div>
      <div>Type</div>
      <div>Amount</div>
    </div>
    <div class="flex flex-col w-full h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '@/assets/config.scss';
.list-header {
  border-bottom: 1px solid $gray-color;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: $gray-color;
}
</style>
