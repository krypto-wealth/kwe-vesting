<template>
  <div>
    <template v-if="!login">
      <GCard shadow class="flex flex-col items-center justify-between mb-10 connect-card">
        <img class="max-w-[293px]" src="../../assets/img/time.png" alt="cloud" />
        <p
          class="text-white text-center w-[265px] md:w-[457px] text-[15px] leading-[23px]"
        >
          This page is dedicated to the vesting of KWE tokens. To enter the vesting,
          please, connect your wallet provided before to the KWE Network project.
        </p>
        <GButton
          class="w-[211px] h-[49px] font-semibold text-sm"
          primary
          @click="$emit('connect-popup')"
        >
          Connect wallet
        </GButton>
      </GCard>
    </template>
    <template v-else-if="web3.globalLoading">
      <GCard shadow class="flex flex-col items-center mt-4 vesting-card">
        <div class="flex items-center justify-center h-full">
          <GLoader size="100px" v-if="isAllocation" />
          <p v-else-if="!started" class="wait-title">
            Sorry, vesting has not started yet
          </p>
          <p v-else class="wait-title">
            Sorry, you are not participating in any allocations
          </p>
        </div>
      </GCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useWallet, useWeb3 } from '@/gotbit-tools/vue'
import { useVesting } from '@/store/contracts/vesting'

import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import GCard from '@/components/gotbit-ui-kit/GCard.vue'
import GLoader from '@/components/gotbit-ui-kit/GLoader.vue'

const { login } = useWallet()
const vesting = useVesting()

const isAllocation = computed(() => {
  if (vesting.allocations.length === 0) {
    return false
  } else return true
})

const started = computed(() => 1690837200 < Math.floor(Date.now() / 1000))

const web3 = useWeb3()
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
@import '@/assets/config.scss';

.connect-card {
  @include for-size(md) {
    width: 721px;
  }
  width: 343px;
  height: 515px;
  padding: 40px 0;

  &__button {
    height: 64px;
    color: white;
  }
}

.vesting-card {
  @include for-size(md) {
    width: 721px;
    padding: 40px 133px;
    &__header {
      text-align: center;
    }
  }

  width: 343px;
  padding: 16px;

  &__lables {
    width: 100%;
  }
  &__progress-bars {
    width: 100%;
    justify-content: space-evenly;
  }
  &__input-block {
    width: 100%;
    max-width: 454px;
    height: 100%;
    &__title {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    &__balance {
      color: $gray-color;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: -0.5px;
    }
    &__button {
      width: 100%;
      margin-top: 32px;
    }
  }
}
.vesting-schedule {
  @include for-size(md) {
    width: 721px;
    padding: 40px;
    margin-top: 40px;
  }
  width: 343px;
  padding: 16px;
  margin-top: 32px;
}

.wait-title {
  color: #bdbdbd;
  text-align: center;

  font-size: 16px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.5px;
  padding: 25px 10px;
}
</style>
