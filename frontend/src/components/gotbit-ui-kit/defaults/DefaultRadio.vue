<template>
  <div class="toggle_radio__container">
    <span class="toggle_radio__text" v-if="props.label != undefined">
      {{ props.label }}
    </span>
    <div class="toggle_radio" :class="{ active: active }">
      <span class="toggle_radio__icon"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface radioGroupProps {
  label?: string
  active?: boolean
}
const props = defineProps<radioGroupProps>()
</script>

<style scoped lang="scss">
@import '@/assets/config.scss';
$timeout: 0.2s;

.toggle_radio {
  @include size-box(20px);
  position: relative;
  transition: all $timeout linear;

  border: solid 1px {
    color: $gray-color;
    radius: 100%;
  }

  &__container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  &:hover {
    border-color: $gray-dark-color;
    transition: all $timeout linear;
  }
  &:active {
    border-color: $gray-color;
    transition: all $timeout linear;

    &::before {
      background-color: rgba(215, 216, 223, 0.8);
    }
  }
  &.active {
    color: $primary-color;
    border-color: $primary-color;

    &:hover {
      border-color: $primary-dark-color;
    }

    &:active {
      &::before {
        background-color: rgba(179, 216, 255, 0.2);
      }
    }
  }

  &__icon {
    position: absolute;
    left: 3px;
    top: 3px;

    @include size-box(12px);
    background-color: transparent;
    border-radius: 100%;
    transition: all $timeout linear;
  }

  &.active &__icon {
    background-color: $primary-color;
    transition: all $timeout linear;

    &:hover {
      background-color: $primary-dark-color;
    }

    &:active {
      background-color: $primary-color;
    }
  }

  &::before {
    $indent: 8px;
    @include size-box(calc(100% + $indent));

    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    z-index: -1;

    border-radius: 100%;
    transition: all $timeout linear;
  }
}
</style>
