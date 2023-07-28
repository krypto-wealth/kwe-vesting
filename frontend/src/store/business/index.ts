import { useDialogs } from '@/store/ui/dialogs'

import { Dialog, waitDialog } from '@/misc/dialogTexts'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import type { ContractTransaction } from 'ethers'
import { useToken } from '@/store/contracts/token'
import { useVesting } from '@/store/contracts/vesting'
import { useTokenData } from '@/store/data/token'

import { formatTime, nowInSeconds } from '@/misc/utils'
import { useWeb3 } from '@/gotbit-tools/vue'

const createWaiter = (): [Promise<boolean>, (value: boolean) => void] => {
  let resolve: (value: boolean) => void = () => console.log('@click')
  const waiter = new Promise<boolean>((res) => (resolve = res))
  return [waiter, resolve]
}

const createAction = async (
  dialog: Dialog,
  action: () => Promise<ContractTransaction | null>,
) => {
  const dialogs = useDialogs()
  const [waiter, res] = createWaiter()
  const web3 = useWeb3()

  dialogs.openDialog('confirmDialog', {
    ...dialog,
    onConfirm: () => res(true),
    onCancel: () => res(false),
  })

  const response = await waiter
  if (!response) return

  if (web3.chainId !== web3.realChainId) {
    dialogs.openDialog(
      'waitDialog',
      { loading: true, success: false, ...dialog },
      { notClosable: true },
    )
    console.log(2)

    const switched = await web3.switchChain(web3.DEFAULT_CHAINID)
    if (!switched) {
      console.log(3)

      dialogs.openDialog(
        'waitDialog',
        { loading: false, success: false, ...dialog },
        { notClosable: false, noCross: false },
      )
      return
    }
  }
  dialogs.openDialog(
    'waitDialog',
    { loading: true, success: false, ...dialog },
    { notClosable: true },
  )

  const tx = await action()
  if (tx) {
    console.log(4)

    const successDialog = { ...dialog, hash: tx.hash }
    dialogs.openDialog(
      'waitDialog',
      { loading: false, success: true, ...successDialog },
      { noCross: false },
    )
  } else
    dialogs.openDialog(
      'waitDialog',
      { loading: false, success: false, ...dialog },
      { noCross: false },
    )
}

export const useWriteVesting = () => {
  const vesting = useVesting()
  const tokenData = useTokenData()

  return {
    claim: async (amount: string, max = false) =>
      createAction(waitDialog, async () =>
        vesting.claim(
          max ? ethers.constants.MaxUint256 : amount.toBigNumber(tokenData.decimals()),
        ),
      ),
  }
}

export type LinearElement = {
  date: string
  amount: string
  selected: boolean
}

const applyPercentage = (a: BigNumber, p: BigNumberish, precision: BigNumber) =>
  a.mul(p).div(precision).div(100)

export const useReadVesting = () => {
  const vesting = useVesting()
  const { decimals } = useToken()

  const rounds = vesting.rounds
  return {
    startTimestamp: () => vesting.startTimestamp.formatNumber(0),

    endTimeStamp: (roundId: number) => {
      const now = nowInSeconds()

      const round = rounds[roundId]

      const pastPeriods = round.periods.filter((period) => period.startTimestamp.lte(now))
      const lastPastIndex = pastPeriods.length - 1
      const nextPeriodIndex = lastPastIndex + 1

      const nextStart = round.periods[nextPeriodIndex]?.startTimestamp.toNumber() ?? now

      return nextStart - now
    },

    TGE: (roundId: number) => {
      const round = rounds[roundId]
      const firstPeriod = round.periods[0]
      const allocation = vesting.allocations[0][0][roundId].toBigNumber(0)

      const hasTGE =
        firstPeriod.duration === 0 &&
        firstPeriod.linearUnits === 1 &&
        firstPeriod.percentageD.formatNumber(decimals) > 0

      const amount =
        (allocation.formatNumber() * firstPeriod.percentageD.formatNumber()) / 100

      const timestamp = `${firstPeriod.startTimestamp
        .formatNumber(0)
        .toDate('DD.MM.YY HH:mm')}`

      return {
        amount: hasTGE ? amount.toString() : '0',
        timestamp: hasTGE ? timestamp : '0',
      }
    },
    linears: (roundId: number) => {
      const round = rounds[roundId]
      const firstPeriod = round.periods[0]
      const allocation = vesting.allocations[0][0][roundId].toBigNumber(0)

      const hasTGE =
        firstPeriod.duration === 0 &&
        firstPeriod.linearUnits === 1 &&
        firstPeriod.percentageD.formatNumber(decimals) > 0

      const periods = round.periods.slice(hasTGE ? 1 : 0)

      const format = 'DD.MM.YY HH:mm'

      return periods.map((p) => {
        const startTimestamp = p.startTimestamp.toNumber()
        const amount =
          allocation
            .mul(p.percentageD)
            .div(BigNumber.from(10).pow(18).mul(100))
            .formatNumber(decimals) ?? ''

        if (p.duration === 0)
          return {
            amount,
            timestamp: startTimestamp.toDate(format),
          }

        return {
          amount,
          timestamp:
            startTimestamp.toDate('DD.MM.YY') +
            ' - ' +
            (startTimestamp + p.duration).toDate(format),
        }

        // return {
        //   amount,
        //   timestamp: p.duration
        //     ? `${p.startTimestamp.formatNumber(0).toDate('DD.MM.YY HH:mm')} - ${(
        //         p.startTimestamp.formatNumber(0) + p.duration
        //       ).toDate('DD.MM.YY HH:mm')}`
        //     : `${p.startTimestamp.formatNumber(0).toDate('DD.MM.YY HH:mm')}`,
        // }
      })
    },
    cliffPeriod: (roundId: number) => {
      const round = rounds[roundId]
      const firstPeriod = round.periods[0]
      const secondPeriod = round.periods[1]
      const hasTGE =
        firstPeriod.duration === 0 &&
        firstPeriod.linearUnits === 1 &&
        firstPeriod.percentageD.formatNumber(decimals) > 0
      const hasCliff =
        secondPeriod.percentageD.formatNumber() === 0 ||
        (hasTGE &&
          secondPeriod.startTimestamp.formatNumber(0) -
            firstPeriod.startTimestamp.formatNumber(0) >
            0)
      const timestamp = secondPeriod[0].formatNumber(0) - firstPeriod[0].formatNumber(0)

      return {
        hasCliff,
        timestamp: hasCliff ? formatTime(timestamp) : '',
      }
    },

    allocations: (roundId: number) => {
      const allocationTokens = vesting.allocations[0][0][roundId].toBigNumber(0)
      const claimedAmount = vesting.claimed[roundId]
      const unlockAmount = vesting.unlocked[roundId]
      const unclockedSummary = vesting.unclockedSummary
      const claimedSummary = vesting.claimedSummary
      const allocationSummary = vesting.allocationSummary
      const lockedAmount = allocationTokens.sub(unlockAmount)

      return {
        summary: allocationTokens.formatString(decimals, 2) ?? 0,
        claimedAmount: claimedAmount.formatNumber(decimals, 2) ?? 0,
        claimableAmount: unlockAmount.sub(claimedAmount).formatNumber(decimals, 2) ?? 0,
        lockedAmount: Math.ceil(lockedAmount.formatNumber(decimals, 3) * 100) / 100 ?? 0,
        allocationSummary: allocationSummary.formatNumber(decimals, 2) ?? 0,
        unclockedSummary: unclockedSummary.formatNumber(decimals, 2) ?? 0,
        claimedSummary: claimedSummary.formatNumber(decimals, 2) ?? 0,
        claimableSummary: unclockedSummary.sub(claimedSummary).formatNumber(decimals, 2),
      }
    },

    nextUnlock: (roundId: number) => {
      const now = nowInSeconds()

      const round = rounds[roundId]
      const allocation = BigNumber.from(vesting.allocations[0][0][roundId])

      const pastPeriods = round.periods.filter((period) => period.startTimestamp.lte(now))
      const lastPastIndex = pastPeriods.length - 1
      const nextPeriodIndex = lastPastIndex + 1

      if (vesting.startTimestamp.toNumber() === 0)
        return {
          date: 'Not started',
          amount: '0',
        }
      else if (nextPeriodIndex > round.periods.length - 1)
        return {
          date: 'Finished',
          amount: '0',
        }
      else
        return {
          date:
            round.periods[nextPeriodIndex].startTimestamp
              .toNumber()
              .toDate('DD.MM.YY HH:mm') ?? '',
          amount:
            allocation
              .mul(round.periods[nextPeriodIndex].percentageD)
              .div(BigNumber.from(10).pow(18).mul(100))
              .formatNumber(decimals) ?? '',
        }
    },
  }
}
