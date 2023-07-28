<template>
  <GSelector
    v-if="selectorOptions?.length"
    :options="selectorOptions"
    v-model="ui.selectedRound"
    class="w-full md:hidden"
  />
  <GCard shadow class="flex flex-col items-center justify-between mt-4 vesting-card">
    <h2 class="md:hidden py-[24px] text-[20px] font-bold text-white">
      Vesting information
    </h2>
    <div
      class="relative w-full items-center justify-between hidden md:flex vesting-card__header"
    >
      <h2 class="font-bold text-[20px] text-white">Vesting information</h2>
      <GSelector
        v-if="selectorOptions?.length"
        :options="selectorOptions"
        v-model="ui.selectedRound"
        class="w-[184px]"
      />
    </div>
    <div
      class="flex flex-col md:flex-row md:space-y-0 md:mt-8 md:justify-between space-y-[12px] vesting-card__lables"
    >
      <LableWithShadow
        title="Token allocation"
        :info="`${allocation.summary} ${symbol}`"
        :hint="hints.tokenAllocation.value"
      />
      <LableWithShadow
        title="Duration"
        :info="durationLabel.value"
        :hint="hints.duration"
      />
    </div>

    <div class="mt-6 vesting-card__unlock-card md:mt-8 w-full">
      <UnlockCard
        :leftInfo="`${nextUnlock.date ?? '-'}`"
        leftTitle="Date"
        :rightInfo="`${nextUnlock.amount ?? '0.0'} ${symbol}`"
        rightTitle="Amount"
      />
    </div>

    <div class="flex flex-row mt-6 vesting-card__progress-bars md:mt-8">
      <ProgressBar
        class="w-full h-full"
        :first-amount="allocation.lockedAmount"
        :second-amount="allocation.claimableAmount"
        :third-amount="allocation.claimedAmount"
        first-color="#7878805C"
        second-color="#03E287"
        third-color="#BBCDC6"
      />
    </div>
  </GCard>
  <GCard class="mt-8 md:!px-[46px] md:!py-[56px] !py-8">
    <div class="vesting-card__input-block flex-col md:flex-row flex">
      <div class="text-white justify-betwen w-full items-center">
        <div class="flex">
          <p class="text-[15px] text-[#e0e0e0]">Total Claimable amount</p>
          <GTooltip
            v-if="hints.claimalableAmount"
            class="ml-[14px]"
            position="right"
            :hint="hints.claimalableAmount"
          />
        </div>
        <p class="text-[16px] mt-1 md:mt-0">
          {{ allocation.claimableAmount }} {{ symbol }}
        </p>
      </div>

      <GButton
        class="vesting-card__input-block__button mt-4 md:mt-0"
        @click="onClaim"
        :disabled="!isStarted || allocation.claimableAmount == 0"
        primary
      >
        Claim
      </GButton>
    </div>
  </GCard>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watchEffect } from 'vue'

import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import GCard from '@/components/gotbit-ui-kit/GCard.vue'
import GSelector from '@/components/gotbit-ui-kit/GSelector.vue'
import LableWithShadow from '@/components/vesting/LableWithShadow.vue'
import ProgressBar from '@/components/vesting/ProgressBar.vue'
import UnlockCard from '@/components/vesting/UnlockCard.vue'
import GTooltip from '../gotbit-ui-kit/GTooltip.vue'

import { useVesting } from '@/store/contracts/vesting'

import { useReadVesting, useWriteVesting } from '@/store/business/index'
import { useTokenData } from '@/store/data/token'

import { useUI } from '@/store/ui/ui'
import { ethers } from 'ethers'

interface ISelectorOptions {
  value: string | number
  label: string
}

interface SelectorProps {
  options: ISelectorOptions[]
  modelValue?: string | number
  dropdownWidth?: string
}

const vesting = useVesting()
const tokenData = useTokenData()
const vestingActions = useWriteVesting()
const vestingRead = useReadVesting()
const ui = useUI()

const selectedRound = ref(ui.selectedRound)

const symbol = computed(() => tokenData.symbol())

const timeoutId = ref<NodeJS.Timeout | null>(null)

const isStarted = computed(() => startTimestamp.value !== 0)

const selectorOptions = computed<SelectorProps['options']>(() =>
  vesting.rounds.map((round, i) => ({
    value: i,
    label: round.name.slice(0, 1).toUpperCase() + round.name.slice(1).toLowerCase(),
  })),
)

const getTime = (time: number) => (time < 10 ? `0${time}` : time)

const allocation = computed(() => vestingRead.allocations(selectedRound.value))
const nextUnlock = computed(() => vestingRead.nextUnlock(selectedRound.value))
const startTimestamp = computed(() => vestingRead.startTimestamp())

const durationLabel = computed(() => {
  if (durationInSeconds.value < 0) {
    return {
      value: '00 : 00 : 00 : 00',
    }
  }
  if (isStarted.value && Number(allocation.value.summary) > 0)
    return {
      value: `${getTime(durationTime.days)} : ${getTime(durationTime.hours)} : ${getTime(
        durationTime.minutes,
      )} : ${getTime(durationTime.seconds)}`,
    }
  else
    return {
      value: 'Not started',
    }
})
const durationInSeconds = ref(vestingRead.endTimeStamp(selectedRound.value))

const durationTime = reactive<{
  days: number
  hours: number
  minutes: number
  seconds: number
}>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

const onClaim = () => vestingActions.claim('inf', true)

const updateTime = () => {
  durationInSeconds.value -= 1

  if (durationInSeconds.value < 0) {
    timeoutId.value = setTimeout(updateTime, 1000)
    return
  }

  durationTime.days = Math.floor(durationInSeconds.value / 60 / 60 / 24)
  durationTime.hours = Math.floor((durationInSeconds.value / 60 / 60) % 24)
  durationTime.minutes = Math.floor((durationInSeconds.value / 60) % 60)
  durationTime.seconds = Math.floor(durationInSeconds.value % 60)

  timeoutId.value = setTimeout(updateTime, 1000)
}

const hints = {
  tokenAllocation: computed(
    () =>
      `Token allocation is the amount of tokens that can be claimed according to the Vesting Schedule. \n Token allocation: ${allocation.value.summary} ${symbol.value}`,
  ),
  duration:
    'Token allocation is the amount of tokens that can be claimed according to the Vesting Schedule.',
  claimalableAmount:
    'The amount of a token which can be claimed at the moment from all the rounds’ pools.',
}

onMounted(updateTime)

watchEffect(() => {
  selectedRound.value = ui.selectedRound
  durationInSeconds.value = vestingRead.endTimeStamp(selectedRound.value)
})
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
@import '@/assets/config.scss';

.connect-card {
  @include for-size(md) {
    width: 721px;
  }
  width: 343px;
  padding: 40px 0;

  &__button {
    width: 100%;
    height: 100%;
    max-width: 260px;
    margin-top: 40px;
    height: 64px;
    color: white;
  }
}

.vesting-card {
  @include for-size(md) {
    width: 737px;
    padding: 36px 45px;
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
      max-width: 315px;
      height: 50px;
      font-size: 14px;
      font-weight: 500;
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
</style>
