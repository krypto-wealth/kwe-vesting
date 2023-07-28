import { run } from '@/gotbit-tools/hardhat'
import { BigNumber } from 'ethers'

const applyPercent = (
  value: BigNumber,
  percent: BigNumber,
  precision = BigNumber.from('10').pow(18)
) => {
  return value.mul(percent).div(precision)
}

run('calc', async () => {
  const init = '25000000000000'.toBigNumber(18)
  const percent = BigNumber.from('8333333333333336000')

  const last = BigNumber.from('100000000000000000000').sub(percent.mul(11))
  console.log(last.toString())

  console.log(applyPercent(init, percent).formatString(18))
})
// 208333333333333.33
