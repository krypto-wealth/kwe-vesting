import { expect, describe, beforeEach, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useToken } from '@/store/contracts/token'

describe('Token Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('should init ui store', () => {
    const ui = useToken()
  })
})
