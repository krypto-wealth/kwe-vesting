<template>
  <div class="relative flex">
    <TooltipIcon
      class="cursor-pointer"
      :class="{ 'tooltip-hover': !hover }"
      @mouseenter="!sm ? (hover = true) : null"
      @mouseleave="!sm ? (hover = false) : null"
      size="20px"
      @click="hover = !hover"
    />
    <div
      v-if="!hint.includes('Token allocation:')"
      class="tooltip-hint"
      :class="[tooltipPosition, { 'tooltip-hint__hover': hover }]"
    >
      {{ hint }}
    </div>
    <div
      v-else
      class="tooltip-hint"
      :class="[tooltipPosition, { 'tooltip-hint__hover': hover }]"
    >
      <p>{{ hint.slice(0, 100) }}</p>
      <p>{{ hint.slice(100) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import TooltipIcon from '@/components/gotbit-ui-kit/icons/TooltipIcon.vue'

import type { Position } from '@/components/gotbit-ui-kit/types'

import { useMedia } from '@/composables'

const { sm } = useMedia()

export interface TooltipProps {
  position?: Position
  positionMob?: Position
  hint: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'right',
  positionMob: 'bottom',
})

const hover = ref<boolean>(false)

const tooltipPosition = computed((): Position => {
  if (windowWidth.value < 769) return props.positionMob
  else return props.position
})

const windowWidth = ref<number>(window.innerWidth)
const onWidthChange = () => (windowWidth.value = window.innerWidth)

onMounted(() => window.addEventListener('resize', onWidthChange))
onUnmounted(() => window.removeEventListener('resize', onWidthChange))
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';

.tooltip-hover {
  opacity: 0.45;
}

.tooltip-hint {
  position: absolute;
  display: none;
  width: 288px;
  background-color: rgba(27, 44, 57, 0.3);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 12px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: $white-color;

  z-index: 10;

  &__hover {
    display: block;
  }

  &.right {
    left: 40px;
    top: -75%;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      left: -8px;
      top: calc(50% - 8px);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
  }

  &.bottom {
    right: -50px;
    top: 50px;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid rgba(27, 44, 57, 0.3);
      left: calc(100% - 68px);
      bottom: 100%;
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
  }

  &.left {
    right: 40px;
    top: -75%;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid rgba(27, 44, 57, 0.3);
      right: -8px;
      top: calc(50% - 8px);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
  }

  &.top {
    right: -50px;
    bottom: 50px;

    &:before {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid rgba(27, 44, 57, 0.3);
      left: calc(100% - 68px);
      top: 100%;
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
  }
}
</style>
