import { Vesting } from '@/contracts/typechain'
import {
  MulticallWorker,
  safeWrite,
  safeRead,
  useWeb3,
  useContracts,
} from '@/gotbit-tools/vue'
import { defineContractStore } from '@/gotbit-tools/vue/store'
import { DEFAULT_CHAINID } from '@/gotbit.config'
import { BigNumber } from 'ethers'
import type { ContractTransaction } from 'ethers'
import type { Allocations } from '@/api/alloc'
import { getAllocations } from '@/api/alloc'
import { getLeaves, User } from '@/utils/parseAllocations'
import { generateProof } from '@/utils/merkleTree'

export interface IVestingState {
  rounds: Awaited<ReturnType<Vesting['getRounds']>>
  startTimestamp: BigNumber
  allocationsPoint: string
  allocations: Allocations
  leaves: string[]
  leavesRaw: User[]
  userIndex: number
  claimed: Awaited<ReturnType<Vesting['claimed']>>[]
  unlocked: Awaited<ReturnType<Vesting['unlocked']>>[]
  claimedSummary: BigNumber
  unclockedSummary: BigNumber
  allocationSummary: BigNumber
}
export interface IVestingActions {
  claim: (amount: BigNumber) => Promise<ContractTransaction | null>
}

export const useVesting = defineContractStore<IVestingState, IVestingActions>('vesting', {
  state: () => ({
    loading: false,
    rounds: [],
    startTimestamp: BigNumber.from(0),
    allocationsPoint: '',
    allocations: [],
    leaves: [],
    leavesRaw: [],
    userIndex: 0,
    claimed: [],
    unlocked: [],
    claimedSummary: BigNumber.from(0),
    unclockedSummary: BigNumber.from(0),
    allocationSummary: BigNumber.from(0),
  }),
  actions: {
    async onLogin() {
      this.loading = true
      const web3 = useWeb3()
      const { $vesting, vesting } = useContracts(undefined, DEFAULT_CHAINID)
      const multicallWorker = new MulticallWorker('Vesting multicall')

      this.allocationsPoint = await safeRead(vesting.getAllocations(), '')

      // parse allocations
      multicallWorker.requestCall($vesting.getAllocations(), async (leavesUrl) => {
        if (!leavesUrl) return
        const leavesInfo = await getLeaves(leavesUrl)
        if (!leavesInfo) return

        this.leaves = leavesInfo.leaves
        this.leavesRaw = leavesInfo.leavesRaw
        this.userIndex = leavesInfo.userIndex
      })

      multicallWorker.requestCall($vesting.getRounds(), async (rounds) => {
        if (!rounds) return
        this.rounds = rounds

        for (let roundId = 0; roundId < rounds.length; roundId++) {
          const alloc = await getAllocations(this.allocationsPoint)

          // allocations for user
          this.allocations = alloc.filter((a) => a[1] === web3.wallet)
          const allocationsForRound = this.allocations[0][0][roundId]
          const allocation = allocationsForRound.toBigNumber(0)
          // sum alloc
          this.allocationSummary = allocation.add(allocation ?? BigNumber.from(0))

          multicallWorker.requestCall(
            $vesting.unlocked(roundId, allocationsForRound),
            (unlocked) => {
              this.unlocked[roundId] = unlocked ?? BigNumber.from(0)
              this.unclockedSummary = this.unclockedSummary.add(
                unlocked ?? BigNumber.from(0),
              )
            },
          )

          multicallWorker.requestCall(
            $vesting.claimed(web3.wallet, roundId),
            (claimed) => {
              this.claimed[roundId] = claimed ?? BigNumber.from(0)
              this.claimedSummary = this.claimedSummary.add(claimed ?? BigNumber.from(0))
            },
          )
        }
      })

      this.startTimestamp = await safeRead(vesting.startTimestamp(), BigNumber.from(0))

      await multicallWorker.fulfillCalls(DEFAULT_CHAINID)

      this.loading = false
      return true
    },
    async onFinal() {
      this.loading = false
      return true
    },

    async claim(amount) {
      const web3 = useWeb3()
      const { vesting } = useContracts(web3.signer!, DEFAULT_CHAINID)

      console.log('alloc', this.leavesRaw[this.userIndex][0])
      console.log('bytes', generateProof(this.leaves, this.leaves[this.userIndex]))
      console.log('amount', amount)

      const [tx] = await safeWrite(
        vesting.claimAll(
          this.leavesRaw[this.userIndex][0],
          generateProof(this.leaves, this.leaves[this.userIndex]),
          amount,
        ),
      )

      web3.loadAll({ init: false, login: true })
      return tx
    },
  },
})
