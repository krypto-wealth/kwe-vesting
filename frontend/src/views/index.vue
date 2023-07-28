<template>
  <MainLayout>
    <div class="main_info">
      <h1 class="main-title text-white">Vesting platform</h1>

      <p class="main_description uppercase text-primary">for KWE tokens</p>
    </div>

    <Transition name="move">
      <div>
        <div class="pt-[32px] md:pt-[64px]">
          <VestingPreconnect @connect-popup="dialogs.openDialog('connectDialog', {})" />
        </div>
        <VestingCard v-if="showContent" />
        <div v-if="showContent" class="pb-[64px] md:pb-[100px]">
          <VestingSchedule />
        </div>
      </div>
    </Transition>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import VestingPreconnect from '@/components/main/VestingPreconnect.vue'
import VestingCard from '@/components/main/VestingCard.vue'
import VestingSchedule from '@/components/main/VestingSchedule.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import { useDialogs } from '@/store/ui/dialogs'
import { useEvent, useWallet } from '@/gotbit-tools/vue'

const dialogs = useDialogs()
const { login } = useWallet()

const showContent = ref(false)

useEvent().addListener('beforeOnLogout', () => (showContent.value = false))
useEvent().addListener('beforeOnLogin', () => (showContent.value = false))
useEvent().addListener('afterOnFinal', () => (showContent.value = login.value))
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
.main {
  &_info {
    padding-top: 42px;
    @include flex(column, flex-start, center);
  }
  &-title {
    font-family: 'FONTSPRING DEMO - Nekst';
    font-size: 38px;
    @include for-size(lg) {
      font-size: 52px;
    }

    font-weight: 600;
    .primary {
      font-weight: 900;
      color: $primary-color;
    }
  }

  &_description {
    width: 100%;
    max-width: 580px;
    margin-top: 16px;
    text-align: center;
    color: $primary-color;
    font-size: 14px;
    @include for-size(lg) {
      font-size: 16px;
      margin-top: 24px;
    }
  }
}

.move-enter-active,
.move-leave-active {
  transition: all 0.4s ease;
}
.move-enter-from,
.move-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
