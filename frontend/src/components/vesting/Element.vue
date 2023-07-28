<template>
  <div
    v-if="!props.empty"
    class="el-container text-white flex w-full h-[88px] md:h-[60px] justify-between items-center rounded-[8px]"
    :class="{
      selected: props.selected,
    }"
  >
    <span class="text-base w-[90px] md:w-[220px] h-[28px]">
      {{ props.time }}
      <!-- {{
        props.label === 'TGE'
          ? props.time.slice(0, 14).replace(/\./g, '/')
          : props.time.slice(0, 8).replace(/\./g, '/')
      }}
      -
      {{ props.time.slice(16, 31).replace(/\./g, '/') }} -->
    </span>
    <span class="text-base w-[90px] md:w-[180px] h-[28px] text-center">
      {{ props.label }}
    </span>
    <span class="text-base w-[90px] md:w-[220px] h-[28px] text-right font-medium">
      {{ props.amount }}
    </span>
    <div
      v-if="props.selected"
      class="px-1 -translate-y-[50%] top-[0] right-[20px] text-right main-body absolute"
    >
      next
    </div>
  </div>
  <div
    v-else
    class="flex -left-[17px] md:left-0 rounded-none md:rounded-[24px] w-[343px] md:w-full justify-center items-center cliff-el"
    :class="{
      selected: props.selected,
    }"
  >
    {{ props.label }} {{ props.time }}
  </div>
</template>

<script setup lang="ts">
export interface ElementProps {
  time: string
  amount?: string
  label: string

  empty?: boolean
  selected?: boolean
}

const props = defineProps<ElementProps>()
</script>

<style scoped lang="scss">
@import '@/assets/config.scss';
@import '@/assets/config.scss';

.main-body {
  font-weight: 400;
  font-size: 16px;
  color: $primary-color;
}

.selected {
  outline: 2px solid $primary-color;
}

.cliff-el {
  background-color: #f4f6f9;
  color: $white-color;
  font-weight: 500;
  font-size: 16px;
  height: 76px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
}
.el-container {
  width: 100%;
  padding: 16px 8px;
}

.type-text .date-text {
  font-weight: 400;
}
</style>
