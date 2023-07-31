import type { KWEToken, Presale, Token, Vesting } from './typechain'
export type TypedInterface = 'KWEToken' | 'Presale' | 'Token' | 'Vesting'
export type ContractInterface<Name> = Name extends 'KWEToken'
  ? KWEToken
  : Name extends 'Presale'
  ? Presale
  : Name extends 'Token'
  ? Token
  : Name extends 'Vesting'
  ? Vesting
  : never
