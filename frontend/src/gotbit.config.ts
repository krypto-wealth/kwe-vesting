import { addContractWithAddress } from './gotbit-tools/vue/utils/contracts/add'
import { addContract, defineConfig } from '@/gotbit-tools/vue/config'
import { universalRpc } from '@/gotbit-tools/vue/rpc'

export const IS_DEBUG = import.meta.env.VITE_DEBUG === 'true'

const CHAIN_ID = IS_DEBUG ? '1' : '1'
export const DEFAULT_CHAINID = '1'

export const config = defineConfig({
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  chainIds: ['1'],
  DEFAULT_CHAINID: CHAIN_ID,
  rpc: universalRpc(),
})

import { defineContracts } from '@/gotbit-tools/vue/config'
import type { Token, Vesting } from '@/contracts/typechain'
export const contracts = defineContracts({
  anyToken: addContractWithAddress<Token>('KWEToken'),
  token: addContract<Token>('KWEToken'),
  vesting: addContract<Vesting>('Vesting'),
  '1': {},
})

import { defineStoreSettings } from '@/gotbit-tools/vue/config'
export const storeSettings = defineStoreSettings(
  [
    import('@/store/contracts/token').then((_) => _.useToken),
    import('@/store/contracts/vesting').then((_) => _.useVesting),
  ],
  {
    preserveConnection: true,
    updateOnChainChange: true,
    updateOnWalletChange: true,
    globalLoading: true,
  },
)
