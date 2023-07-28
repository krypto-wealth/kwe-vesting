import { useToken } from '@/store/contracts/token'
import { DEFAULT_CHAINID } from '@/gotbit.config'
import type { ChainId } from '@/gotbit-tools/vue/types'

export const useTokenData = () => {
  const token = useToken()
  return {
    balance: (chainId: ChainId = DEFAULT_CHAINID, precision = 2) =>
      token.balances[chainId][token.token].formatString(token.decimals, precision, true),
    isApproved: (address: string, chainId: ChainId = DEFAULT_CHAINID) =>
      token.allowances[chainId][address],
    symbol: () => token.symbol,
    decimals: () => token.decimals,
  }
}
