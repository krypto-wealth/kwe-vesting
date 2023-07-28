<script setup lang="ts">
import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import { useDialogs } from '@/store/ui/dialogs'

export interface ConfirmDialogProps {
  title: string
  buttonText: string
  text: string
  onConfirm: () => any
  onCancel: () => any
}

const props = defineProps<ConfirmDialogProps>()
const dialogs = useDialogs()
</script>

<template>
  <div class="unstake-dialog w-[311px] md:w-[442px]">
    <div class="title">
      <div
        class="title__header font-bold text-2xl md:text-[32px] md:leading-[40px] text-white"
      >
        {{ title }}
      </div>
      <div class="mt-6 text-sm md:text-base small-text">
        By pressing <span>{{ buttonText }}</span> {{ text }}
      </div>
    </div>
    <div
      class="flex flex-col gap-[20px] md:flex-row justify-between mt-[24px] md:mt-[60px]"
    >
      <div class="w-full md:w-[204px]">
        <GButton
          primary
          outline
          size="md"
          class="w-full !py-[11px]"
          @click="
            () => {
              dialogs.closeCurrentDialog()
              props.onCancel()
            }
          "
          >Cancel</GButton
        >
      </div>
      <div class="w-full md:w-[204px]">
        <GButton
          primary
          size="md"
          class="w-full !py-[11px]"
          @click="
            () => {
              props.onConfirm()
            }
          "
          >{{ buttonText }}</GButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/config.scss';
@import '@/assets/config.scss';

.unstake-dialog {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: transparent;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
}

.title__header {
  font-family: 'FONTSPRING DEMO - Nekst';
}

.small-text {
  font-style: normal;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.5px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: #bdbdbd;
  text-align: center;
  line-height: 28px;
  letter-spacing: -0.5px;

  span {
    color: $primary-color;
  }
}
</style>
