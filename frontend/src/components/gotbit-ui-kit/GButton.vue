<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ButtonHTMLAttributes } from 'vue'
import type { Size, State } from '@/components/gotbit-ui-kit/types'

import LoaderIcon from '@/components/gotbit-ui-kit/icons/LoaderIcon.vue'
import DoneIcon from '@/components/gotbit-ui-kit/icons/DoneIcon.vue'

export interface ButtonProps extends ButtonHTMLAttributes {
  size?: Size
  state?: State
  disabled?: boolean

  primary?: boolean
  secondary?: boolean
  outline?: boolean
  ghost?: boolean

  icon?: boolean
  width?: String
}

const props = withDefaults(defineProps<ButtonProps>(), {})

const emit = defineEmits(['click'])
const button = ref<HTMLElement | null>(null)

onMounted(() => {
  try {
    const tag = button.value as any

    if (props.width) {
      tag.style.width = props.width
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
<template>
  <button
    v-bind="props"
    :class="[
      {
        ...props,
      },
      props.size,
      props.state,
    ]"
    @click="emit('click')"
  >
    <slot name="prefix-icon"></slot>
    <slot></slot>
    <slot name="suffix-icon"></slot>

    <LoaderIcon
      v-if="state == 'loader'"
      class="icon__fill"
      size="20"
      stroke="#fff"
      transform="scale(1.2)"
    />
    <DoneIcon v-if="state == 'done'" class="icon__fill" size="20" stroke="#fff" />
  </button>
</template>
<style lang="scss" scoped>
@import '@/assets/config.scss';

// Variables
$timeout: 0.25s;

button {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;

  font: {
    family: $font;
    style: normal;
    weight: 500;
  }

  letter-spacing: -0.5px;
  cursor: pointer;
  border-radius: 8px;
  transition: all linear $timeout;

  &.primary {
    background-color: $primary-color;
    color: $black-color;
    border: 1px solid $primary-color;

    &:hover {
      background-color: transparent;
      border-color: $primary-color;
      color: $white-color;

      transition: all linear $timeout;
    }

    &:active {
      background-color: $primary-press-color;
      border-color: transparent;
      color: $white-color;

      transition: all linear $timeout;
    }

    &.disabled {
      background-color: $primary-disabled-color;
      color: $white-color;
      border: 0;
    }

    &.loader {
      background-color: $primary-color;
      color: $white-color;
      border: 0;

      svg {
        transform: scale(1.8);
      }
    }

    &.done {
      background-color: $primary-color;
      color: $white-color;
      border: 0;
    }
  }

  &.secondary {
    background: linear-gradient(
        180deg,
        rgba(242, 242, 242, 0.15) 0%,
        rgba(242, 242, 242, 0.1) 100%
      ),
      linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12));

    border: 0.5px solid rgba(255, 255, 255, 0.4) !important;

    color: $white-color;
    border: 0;
    &:hover {
      background: linear-gradient(
          180deg,
          rgba(242, 242, 242, 0.15) 0%,
          rgba(242, 242, 242, 0.1) 100%
        ),
        linear-gradient(0deg, rgba(52, 52, 52, 0.12), rgba(52, 52, 52, 0.12));
    }
  }

  &.outline-primary {
    background-color: transparent;
    color: $black-color;
    border: solid $primary-color;
  }
  &.outline {
    background-color: transparent;
    color: $white-color;
    border: 1px solid $primary-color;
    &:hover {
      background-color: $primary-color;
      color: $black-color;
    }
  }

  &.ghost {
    background-color: transparent;
    color: $black-color;
    border: 0;
  }

  &.disabled {
    cursor: not-allowed;
    background-color: $primary-disabled-color;
    color: $white-color;
  }

  &.loader {
    cursor: wait;
  }

  //==Size==
  &.lg {
    gap: 10.5px;
    padding: 22px 52px;
    line-height: 28px;
    font-size: 20px;

    &.outline {
      border-width: 3px;
    }

    &.icon {
      padding: 24px;
      font-size: 0;
      line-height: 0;

      &.outline {
        padding: 21px;
      }
    }

    &.loader {
      padding: 22px 52px;
    }

    &.done {
      padding: 22px 52px;
    }
  }

  &.md {
    gap: 8px;
    padding: 14px 40px;
    line-height: 24px;
    font-size: 16px;

    &.outline {
      border-width: 2px;
    }

    &.icon {
      padding: 14px;
      font-size: 0;
      line-height: 0;

      &.outline {
        padding: 12px;
      }
    }

    &.loader {
      padding: 14px 52.5px;
    }

    &.done {
      padding: 14px 52.5px;
    }
  }

  &.sm {
    gap: 8px;
    padding: 10px 24px;
    line-height: 24px;
    font-size: 16px;

    &.outline {
      border-width: 2px;
    }

    &.icon {
      padding: 10px;
      font-size: 0;
      line-height: 0;

      &.outline {
        padding: 8px;
      }
    }

    &.loader {
      padding: 10px 24px;
    }

    &.done {
      padding: 10px 24px;
    }
  }
}
</style>
