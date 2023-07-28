<script setup lang="ts">
import { computed, ref } from 'vue'

import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import GLoader from '@/components/gotbit-ui-kit/GLoader.vue'
import CopyIcon from '@/components/base/Icons/CopyIcon.vue'

import { scannersLink } from '@/gotbit-tools/vue'
import { useDialogs } from '@/store/ui/dialogs'
import { useBreakpoint } from '@/composables'
import { useWeb3 } from '@/gotbit-tools/vue'

export interface WaitDialogProps {
  loading: boolean
  success: boolean
  waitingMsg: string
  waitingText: string
  errorMsg: string
  successMsg: string
  succesTransaction: string
  hash: string
}

const props = defineProps<WaitDialogProps>()
const dialogs = useDialogs()

const iconSize = computed((): string => {
  if (useBreakpoint(768)) return '40px'
  else return '48px'
})
const resizeHash = computed(
  () => props.hash.slice(0, 25) + '...' + props.hash.slice(props.hash.length - 6),
)
const hash = computed(() => props.hash)

const web3 = useWeb3()

const copied = ref(false)

const copyText = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="wait-dialog w-[311px] md:w-[444px]">
    <div class="title">
      <div v-if="loading" class="wait-text font-bold text-2xl md:text-[32px]">
        {{ waitingMsg }}
      </div>
      <div
        v-if="!loading && success"
        class="wait-text__success flex items-center gap-[12px]"
      >
        Success!
      </div>
      <div
        v-else-if="!loading && !success"
        class="wait-text__error flex items-center gap-[12px]"
      >
        Error!
      </div>

      <div
        v-if="loading && !success"
        class="mb-8 text-sm !text-[#BDBDBD] small-text mt-9 md:text-base"
      >
        {{ waitingText }}
      </div>
      <div
        v-else-if="!loading && success"
        class="mb-6 text-sm !text-[#BDBDBD] small-text mt-4 md:text-base"
      >
        <p>
          {{ succesTransaction.slice(0, 35) }}
        </p>
        <p>
          {{ succesTransaction.slice(35) }}
        </p>
        <div class="transaction-hash">
          <a
            :href="scannersLink.getTx(web3.chainId, props.hash)"
            target="_blank"
            class="primary cursor-pointer"
          >
            {{ resizeHash }}</a
          >

          <span v-if="copied" v-auto-animate class="copied">Copied!</span>

          <div class="w-[25px] h-[25px] cursor-pointer" @click="copyText(hash)">
            <CopyIcon />
          </div>
        </div>
      </div>
      <div
        v-else-if="!loading && !success"
        class="mt-4 mb-6 text-sm small-text !text-[#BDBDBD] md:text-base"
      >
        {{ errorMsg }}
      </div>
    </div>
    <GLoader v-if="loading" class="!my-10" />
    <GButton
      v-else
      primary
      size="md"
      class="w-full md:w-[370px] !py-[11px] mx-auto"
      @click="dialogs.closeCurrentDialog"
    >
      {{ !success ? 'Try again!' : 'Home Page' }}
    </GButton>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/config.scss';
@import '@/assets/config.scss';
.wait-dialog {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: transparent;
  padding: 25px 10px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
}

.wait-text {
  text-align: center;
  font-family: 'FONTSPRING DEMO - Nekst';
  color: white;

  &__error {
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
    @include for-size(lg) {
      font-size: 32px;
      line-height: 40px;
    }
    color: $error-color;
  }
  &__success {
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
    @include for-size(lg) {
      font-size: 32px;
      line-height: 40px;
    }
    color: $primary-color;
  }
}

.transaction-hash {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .primary {
    color: $white-color;
    font-weight: 700;
    margin-right: 6px;
  }
}

.small-text {
  font-style: normal;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.5px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: $gray-dark-color;

  span {
    color: $primary-color;
  }
}

.wait-buttons {
  display: flex;
  justify-content: space-between;
}
.copied {
  color: $primary-color;
  font-size: 12px;
  font-weight: 700;
  position: absolute;
  z-index: 10;
  right: 8px;
  top: -16px;
  @include for-size(md) {
    top: -20px;
    right: 36px;
  }
}
</style>
