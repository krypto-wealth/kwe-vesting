import { safeWrite, useContracts, useWeb3 } from '@/gotbit-tools/vue'
import { defineContractStore } from '@/gotbit-tools/vue/store'
import type { ChainId } from '@/gotbit-tools/vue/types'
import { BigNumber, ethers } from 'ethers'

import { MulticallWorker } from '@/gotbit-tools/vue/utils/multicall'
import { config, DEFAULT_CHAINID } from '@/gotbit.config'

export interface ITokenState {
  symbol: string
  decimals: number
  token: string
  balances: Record<ChainId, Record<string, BigNumber>>
  allowances: Record<ChainId, Record<string, boolean>>
}
export interface ITokenActions {
  approveMax: (spender: string, chainId: ChainId) => Promise<boolean>
}

const getPerChainId = <T>(content: () => T) => {
  const ans: Record<string, T> = {}
  for (const chainId of config.chainIds) {
    ans[chainId] = content()
  }
  return ans
}

export const useToken = defineContractStore<ITokenState, ITokenActions>('token', {
  state: () => ({
    loading: false,
    token: '',
    symbol: 'TKN',
    decimals: 18,
    balances: getPerChainId(() => ({})),
    allowances: getPerChainId(() => ({})),
  }),
  actions: {
    async onInit() {
      const { $anyToken, $vesting } = useContracts(undefined, DEFAULT_CHAINID)
      const multicallWorker = new MulticallWorker('Token init')

      multicallWorker.requestCall($vesting.token(), (token) => {
        if (!token) return
        this.token = token
        multicallWorker.requestCall(
          $anyToken(this.token).symbol(),
          (symbol) => (this.symbol = symbol ?? this.symbol),
        )
        multicallWorker.requestCall(
          $anyToken(this.token).decimals(),
          (decimals) => (this.decimals = decimals ?? this.decimals),
        )
      })

      await multicallWorker.fulfillCalls(DEFAULT_CHAINID)

      return true
    },
    async onLogin() {
      const web3 = useWeb3()

      const multicallWorker = new MulticallWorker('Token login')

      for (const chainId of web3.chainIds as ChainId[]) {
        const { $anyToken, vesting, $vesting } = useContracts(undefined, chainId)

        multicallWorker.requestCall($vesting.token(), (token) => {
          if (!token) return
          this.token = token
          multicallWorker.requestCall(
            $anyToken(this.token).balanceOf(web3.wallet),
            (balance) => {
              this.balances[chainId][token] = balance ?? BigNumber.from(0)
            },
          )
          multicallWorker.requestCall(
            $anyToken(this.token).allowance(web3.wallet, vesting.address),
            (allowance) => {
              this.allowances[chainId][vesting.address] =
                allowance?.gte(ethers.constants.MaxUint256.div(2)) ?? false
            },
          )
        })
        await multicallWorker.fulfillCalls(chainId)
      }

      return true
    },
    async approveMax(spender, chainId = DEFAULT_CHAINID) {
      const web3 = useWeb3()
      const { anyToken } = useContracts(web3.signer!, chainId)
      if (this.allowances[chainId][spender]) return true
      const [tx] = await safeWrite(
        anyToken(this.token).approve(spender, ethers.constants.MaxUint256),
      )

      if (Boolean(tx)) {
        this.allowances[chainId][spender] = true
      }
      await web3.loadAll({ login: true })
      return Boolean(tx)
    },
  },
})
