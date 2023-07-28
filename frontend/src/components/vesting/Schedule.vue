<template>
  <div class="w-full">
    <div class="flex h-[44px] justify-between items-center list-header">
      <div>Date</div>
      <div>Amount</div>
    </div>
    <div class="flex flex-col w-full h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.list-header {
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: #a099a4;
}
</style>
