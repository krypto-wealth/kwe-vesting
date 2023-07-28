<template>
  <div class="loader" :style="styleSize">
    <div :style="{ ...styleBorder, ...styleSize, ...styleColor }" />
  </div>
</template>

<script setup lang="ts">
export interface LoaderProps {
  color?: string
  size?: string
  border?: string
}

const props = defineProps<LoaderProps>()

const styleSize = {
  width: `${props.size} !important`,
  height: `${props.size} !important`,
}
const styleBorder = {
  'border-width': `${props.border} !important`,
}
const styleColor = {
  'border-color': `${props.color} ${props.color} ${props.color} transparent !important`,
}
</script>

<style scoped lang="scss">
@import '@/assets/config.scss';

.loader {
  display: inline-block;
  width: 48px;
  height: 48px;
  margin: 10px auto;

  & div {
    width: 48px;
    height: 48px;
    border-width: 4px;
    border-style: solid;
    border-color: $primary-color $primary-color $primary-color transparent;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
