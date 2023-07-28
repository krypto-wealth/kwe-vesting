<template>
  <GCard
    v-if="isStarted && allocation.summary"
    shadow
    class="flex flex-col items-center vesting-schedule"
  >
    <div class="self-start text-white font-bold py-[24px] md:py-0">Vesting schedule</div>
    <Schedule class="md:mt-8">
      <Element
        v-if="Number(TGE.amount)"
        label="TGE"
        :amount="`${TGE.amount} ${symbol}`"
        :time="TGE.timestamp"
      />
      <Element
        v-if="cliffPeriod.hasCliff"
        label="Cliff"
        :time="cliffPeriod.timestamp"
        empty
      />
      <Element
        v-for="elem of linears"
        label="Linear"
        :amount="`${formatBigNums(elem.amount)} ${symbol}`"
        :time="elem.timestamp"
      />
    </Schedule>
  </GCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import GCard from '@/components/gotbit-ui-kit/GCard.vue'
import Schedule from '@/components/vesting/Schedule.vue'

import Element from '@/components/vesting/Element.vue'

import { useReadVesting } from '@/store/business/index'
import { useTokenData } from '@/store/data/token'
import { useUI } from '@/store/ui/ui'
import { formatBigNums } from '@/misc/utils'

const tokenData = useTokenData()
const vestingRead = useReadVesting()
const ui = useUI()

const symbol = computed(() => tokenData.symbol())

const isStarted = computed(() => startTimestamp.value !== 0)

// const selectedSchedule = computed(() => {
//   if (vestingRead.linears(ui.selectedRound).filter((l) => l.selected).length)
//     return vestingRead.linears(ui.selectedRound).filter((l) => l.selected)[0].date
//   else return ''
// })

const cliffPeriod = computed(() => vestingRead.cliffPeriod(ui.selectedRound))
const startTimestamp = computed(() => vestingRead.startTimestamp())
const TGE = computed(() => vestingRead.TGE(ui.selectedRound))
const linears = computed(() => vestingRead.linears(ui.selectedRound))
// const currentPeriod = computed(() => vestingRead.currentPeriod(ui.selectedRound))
const allocation = computed(() => vestingRead.allocations(ui.selectedRound))
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
@import '@/assets/config.scss';

.vesting-schedule {
  width: 343px;
  padding: 16px;
  margin-top: 32px;
  @include for-size(md) {
    width: 737px;
    padding: 40px;
    margin-top: 40px;
  }
}
</style>
