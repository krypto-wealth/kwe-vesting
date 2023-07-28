import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import type { Vesting, Token } from '@/typechain'

import { safeWrite, setup } from '@/gotbit-tools/hardhat'
import { toLeaves, User } from '@/utils/parse_allocations'
import allocations from '@/configs/allocations.json'
import { calculateRoot, verify, generateProof } from '@/utils/merkle'
import { BigNumberish } from 'ethers'
import { createAdvancedRounds, AdvancedRounds, Round } from '@/test'

export type Period = {
    startTimestamp: BigNumber
    duration: BigNumber
    linearUnits: BigNumber
    percentageD: BigNumber
}

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEKS = DAY * 7
const HANDRED_PERCENTS = '100'.toBigNumber()

const func = setup('Vesting', async () => {
    const [deployer] = await ethers.getSigners()

    const token = await ethers.getContract<Token>('Token')
    const vesting = await ethers.getContract<Vesting>('Vesting')

    // VESTING SETUP, WORKS ONLY IF PERCENTAGES ARE CONSTANT FOR EACH ROUND
    console.log('here')

    // let month = WEEKS * 4
    let periodDuration = 3600 // one hour for front tests

    let startTimestamp = parseInt((Date.now() / 1000).toString()) + 10
    const maxPeriodsAmount = 36

    const leavesLink =
        'https://gitlab.com/sergey.kuzmin.gotbit/allocations/-/blob/main/kwe/allocations.json'

    let totalTokens = '300_000_000'.toBigNumber()

    let configs = [
        {
            name: 'Seed Round',
            tge: 810_000,
            perc: '1_870_714',
            startEnd: [5, 18],
            total: 27_000_000,
        },
        {
            name: 'Private Round',
            tge: 2_310_000,
            perc: '3_069_000',
            startEnd: [3, 12],
            total: 33_000_000,
        },
        {
            name: 'Public Round',
            tge: 1_800_000,
            perc: '1_457_143',
            startEnd: [1, 7],
            total: 12_000_000,
        },
        {
            name: 'Treasury',
            tge: 0,
            perc: '1_000_000',
            startEnd: [9, 32],
            total: 24_000_000,
        },
        {
            name: 'Influencers & Marketing',
            tge: 1_080_000,
            perc: '1_178_182',
            startEnd: [11, 32],
            total: 27_000_000,
        },
        {
            name: 'Staking',
            tge: 0,
            perc: '1_730_769',
            startEnd: [11, 36],
            total: 45_000_000,
        },
        {
            name: 'Liquidity',
            tge: 9_180_000,
            perc: '2_241_000',
            startEnd: [1, 20],
            total: 54_000_000,
        },
        {
            name: 'Team',
            tge: 0,
            perc: '1_500_000',
            startEnd: [15, 34],
            total: 30_000_000,
        },
        {
            name: 'Advisors',
            tge: 0,
            perc: '750_000',
            startEnd: [13, 36],
            total: 18_000_000,
        },
        {
            name: 'Ecosystem development',
            tge: 0,
            perc: '1_153_846',
            startEnd: [11, 36],
            total: 30_000_000,
        },
    ]

    let rounds = [] as Round[]
    console.log('here')

    // customize perc values to maximum possible close to 100%
    for (let i = 0; i < configs.length; ++i) {
        let perc = '0'.toBigNumber()

        // getting perc in %
        perc = configs[i].perc.toBigNumber().mul(100).div(configs[i].total)

        // getting the in %
        let tge = configs[i].tge
            .toString()
            .toBigNumber()
            .mul(100)
            .div(configs[i].total)

        // counting cummulative percentage
        let cummulativePerc = tge.add(
            perc.mul(configs[i].startEnd[1] + 1 - configs[i].startEnd[0])
        )

        let percBefore = perc.toString()

        if (cummulativePerc.lt(HANDRED_PERCENTS)) {
            // increasing perc if cummulative < 100%
            let deficientAmount = HANDRED_PERCENTS.sub(cummulativePerc)
            configs[i].perc = perc
                .add(
                    deficientAmount.div(
                        configs[i].startEnd[1] + 1 - configs[i].startEnd[0]
                    )
                )
                .toString()
        } else if (cummulativePerc.gt(HANDRED_PERCENTS)) {
            // decreasing perc if cummulative > 100%

            let redundantAmount = cummulativePerc.sub(HANDRED_PERCENTS)
            configs[i].perc = perc
                .sub(
                    redundantAmount.div(
                        configs[i].startEnd[1] + 1 - configs[i].startEnd[0]
                    )
                )
                .toString()
        } else {
            // does not change value, but change but now stores in percents
            configs[i].perc = perc.toString()
        }

        let diffInPercents = BigNumber.from(configs[i].perc)
            .mul(1_000_000_000)
            .div(percBefore)
        console.log(
            'perc diff',
            parseFloat(diffInPercents.toString()) / 1_000_000_000 - 1
        )
    }
    console.log('here')

    // packing rounds
    for (let i = 0; i < configs.length; ++i) {
        // creating rounds with name end empty round
        rounds.push({
            name: configs[i].name,
            periods: [],
        })

        let cumulativePerc = '0'.toBigNumber()

        // length + 1 because of tge
        for (let j = 0; j < maxPeriodsAmount + 1; ++j) {
            let perc = '0'.toBigNumber()
            let tge = configs[i].tge
                .toString()
                .toBigNumber()
                .mul(100)
                .div(configs[i].total)

            // packing tge period with 0 duration if tge > 0
            if (j == 0 && tge.gt(0)) {
                rounds[i].periods.push({
                    startTimestamp: startTimestamp,
                    duration: 0,
                    linearUnits: 1,
                    percentageD: tge,
                })

                cumulativePerc = cumulativePerc.add(tge)
            }

            // if perc > 0 for current period packing period with corresponding values
            if (j >= configs[i].startEnd[0] && j <= configs[i].startEnd[1]) {
                perc = BigNumber.from(configs[i].perc)

                // if j is the last period index, then we decrease or increase value for remain amount (not greater then periods length weis)
                if (j == configs[i].startEnd[1]) {
                    let total = cumulativePerc.add(perc)
                    if (total.gt(HANDRED_PERCENTS)) {
                        console.log(
                            'diff',
                            total.sub(HANDRED_PERCENTS).toString()
                        )
                        perc = perc.sub(total.sub(HANDRED_PERCENTS))
                    }
                    if (total.lt(HANDRED_PERCENTS)) {
                        console.log(
                            'diff',
                            HANDRED_PERCENTS.sub(total).toString()
                        )

                        perc = perc.add(HANDRED_PERCENTS.sub(total))
                    }
                }

                cumulativePerc = cumulativePerc.add(perc)

                // packing round structure
                rounds[i].periods.push({
                    startTimestamp: startTimestamp + (j - 1) * periodDuration,
                    duration: periodDuration,
                    linearUnits: 1,
                    percentageD: perc,
                })
            }
        }
        console.log(i)
    }

    // _________________________________________________

    const leaves = toLeaves(allocations as User[])
    const root = calculateRoot(leaves)

    // for (const al of allocations as User[])
    //     for (const n of al[0]) totalTokens = totalTokens.add(n)

    await vesting.init(startTimestamp, leavesLink, root, rounds)

    await token.transfer(vesting.address, totalTokens)
    console.log('here')
})
export default func

func.tags = ['Vesting.setup']
// func.dependencies = ['Token.deploy', 'Vesting.deploy']
func.runAtTheEnd = true
