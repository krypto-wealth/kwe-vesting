import { deployments, ethers } from 'hardhat'
import type {
    Token,
    Token__factory,
    Vesting,
    Vesting__factory,
} from '@/typechain'
import { BigNumber, BigNumberish } from 'ethers'
import { User } from '@/utils/parse_allocations'
import allocations from '@/configs/allocations.json'

export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = HOUR * 24
export const WEEK = DAY * 7
export const DELAY = 120 * MINUTE
export const ONE = BigNumber.from(10).pow(18)

export type Fraction = {
    numerator: BigNumberish
    denominator: BigNumberish
}

export type Period = {
    startTimestamp: BigNumberish
    duration: BigNumberish
    linearUnits: BigNumberish
    percentageD: BigNumberish
}

export type Round = {
    name: string
    periods: Period[]
}

export type AdvancedRounds = {
    name: string
    cliff: number
    amountOnStart: BigNumberish
    totalAmount: BigNumberish
    periodOnStart: BigNumberish[]
    periodOnEnd: BigNumberish[]
    periodAmount: BigNumberish[]
    periodLinUnit: BigNumberish[]
}

export class FractionJS {
    constructor(public f: { numerator: BigNumber; denominator: BigNumber }) {}

    get numerator() {
        return this.f.numerator
    }
    get denominator() {
        return this.f.denominator
    }

    add(a: FractionJS) {
        return new FractionJS({
            numerator: this.numerator
                .mul(a.denominator)
                .add(this.denominator.mul(a.numerator)),
            denominator: this.denominator.mul(a.denominator),
        })
    }
    addBN(a: BigNumber) {
        return this.add(
            new FractionJS({ numerator: a, denominator: BigNumber.from(1) })
        )
    }
    sub(a: FractionJS) {
        return new FractionJS({
            numerator: this.numerator
                .mul(a.denominator)
                .sub(this.denominator.mul(a.numerator)),
            denominator: this.denominator.mul(a.denominator),
        })
    }
    subBN(a: BigNumber) {
        return this.sub(
            new FractionJS({ numerator: a, denominator: BigNumber.from(1) })
        )
    }

    mul(a: FractionJS) {
        return new FractionJS({
            numerator: this.numerator.mul(a.numerator),
            denominator: this.denominator.mul(a.denominator),
        })
    }
    mulBN(a: BigNumber) {
        return this.mul(
            new FractionJS({ numerator: a, denominator: BigNumber.from(1) })
        )
    }

    div(a: FractionJS) {
        return new FractionJS({
            numerator: this.numerator.mul(a.denominator),
            denominator: this.denominator.mul(a.numerator),
        })
    }
    divBN(a: BigNumber) {
        return this.div(
            new FractionJS({ numerator: a, denominator: BigNumber.from(1) })
        )
    }

    toBigNumber() {
        return this.numerator.div(this.denominator)
    }
}

export const useContracts = async () => {
    return {
        token: await ethers.getContract<Token>('Token'),
        vesting: await ethers.getContract<Vesting>('Vesting'),
    }
}

export const useContractsFactory = async () => {
    return {
        tokenFactory: await ethers.getContractFactory<Token__factory>('Token'),
        vestingFactory: await ethers.getContractFactory<Vesting__factory>(
            'Vesting'
        ),
    }
}

export const deploy = deployments.createFixture(() =>
    deployments.fixture(undefined, { keepExistingDeployments: true })
)

export const createDateRounds = (
    roundsName: string[],
    startTime: BigNumberish
) => {
    const claimAmount = 12

    const rounds: Round[] = []

    for (let roundId = 0; roundId < roundsName.length; ++roundId) {
        let cookiesPeriods: Period[] = []
        let percentageSum = BigNumber.from(0)

        cookiesPeriods.push({
            startTimestamp: startTime,
            duration: BigNumber.from(0),
            linearUnits: BigNumber.from(1),
            percentageD: BigNumber.from(0),
        } as Period)

        for (let i = 1; i < claimAmount + 1; ++i) {
            cookiesPeriods.push({
                startTimestamp: BigNumber.from(i + 1)
                    .mul(i + 1)
                    .mul(MINUTE)
                    .add(startTime),
                duration: BigNumber.from(0),
                linearUnits: BigNumber.from(1),
                percentageD: ONE.mul(100).div(claimAmount),
            } as Period)

            percentageSum = percentageSum.add(ONE.mul(100).div(claimAmount))
        }

        percentageSum = percentageSum.sub(ONE.mul(100).div(claimAmount))

        cookiesPeriods[cookiesPeriods.length - 1].percentageD =
            ONE.mul(100).sub(percentageSum)

        rounds.push({
            name: roundsName[roundId],
            periods: cookiesPeriods,
        } as Round)
    }

    return rounds
}

export const createRounds = (roundsName: string[], startTime: BigNumberish) => {
    const now = Math.floor(Date.now() / 1000)
    // const startTimestamp = now
    const delay = 120 * MINUTE
    const claimAmount = 12

    const rounds: Round[] = []

    for (let roundId = 0; roundId < roundsName.length; ++roundId) {
        let cookiesPeriods: Period[] = []
        let percentageSum = BigNumber.from(0)

        cookiesPeriods.push({
            startTimestamp: BigNumber.from(startTime).add(MINUTE),
            duration: BigNumber.from(0),
            linearUnits: BigNumber.from(1),
            percentageD: BigNumber.from(0),
        } as Period)

        cookiesPeriods.push({
            startTimestamp: BigNumber.from(6 * HOUR).add(startTime),
            duration: BigNumber.from(0),
            linearUnits: BigNumber.from(1),
            percentageD: ONE.mul(100).div(claimAmount),
        } as Period)

        percentageSum = percentageSum.add(ONE.mul(100).div(claimAmount))

        for (let i = 2; i < claimAmount + 1; ++i) {
            cookiesPeriods.push({
                startTimestamp: BigNumber.from(i * DAY)
                    .add(6 * HOUR)
                    .add(startTime),
                duration: BigNumber.from(DAY),
                linearUnits: BigNumber.from(1),
                percentageD: ONE.mul(100).div(claimAmount),
            } as Period)

            percentageSum = percentageSum.add(ONE.mul(100).div(claimAmount))
        }

        percentageSum = percentageSum.sub(ONE.mul(100).div(claimAmount))

        cookiesPeriods[cookiesPeriods.length - 1].percentageD =
            ONE.mul(100).sub(percentageSum)

        rounds.push({
            name: roundsName[roundId],
            periods: cookiesPeriods,
        } as Round)
    }
    return rounds
}

/**
 * @cliff displaces all timestamp on its own value
 * Example: we got cliff = 5 secs, no TGE and only 1 Linear Period = [start: 10, end: 15]
 * in the end we got: period = [start: 15, end: 20]
 *
 * @amountOnStart is TGE amount, which allocates to users on start
 *
 * @totalAmount is amount of all allocated tokens for current round
 *
 * @periodOnStart [i] is a period when starts linear allocation
 * in scripts if start != end all tokens per period
 *
 * @periodOnEnd [i] is a period when ends linear allocation
 *
 * @periodAmount [i] is an amount per unlock on current Linear Period
 *
 * @periodLinUnit [i] equals 1 second mostly
 *
 * @period amount of time in seconds while lasts 1 piece of Linear Period
 * (there can be more than 1)
 */
export const createAdvancedRounds = (
    roundsInfo: AdvancedRounds[],
    startTime: BigNumberish
) => {
    const rounds: Round[] = []

    roundsInfo.map((round) => {
        const arr = round.periodOnStart.length
        const a_2 = round.periodOnEnd.length
        const a_3 = round.periodAmount.length
        const a_4 = round.periodLinUnit.length

        if (arr != a_2 || arr != a_3 || arr != a_4) {
            throw `Arrays' lengths are different in ${round.name} round`
        }

        for (let i = 0; i < arr; i++) {
            if (round.periodOnStart[i] > round.periodOnEnd[i])
                throw `In ${round.name} on ${
                    i + 1
                }'th period end time is less than start time`
        }

        let advancedPeriods: Period[] = []
        let percentageSum = BigNumber.from(0)

        advancedPeriods.push({
            startTimestamp: BigNumber.from(startTime),
            duration: BigNumber.from(0),
            linearUnits: BigNumber.from(1),
            percentageD: ONE.mul(100)
                .mul(round.amountOnStart)
                .div(round.totalAmount),
        } as Period)

        percentageSum = percentageSum.add(
            ONE.mul(100).mul(round.amountOnStart).div(round.totalAmount)
        )

        for (let i = 0; i < round.periodOnStart.length - 1; ++i) {
            advancedPeriods.push({
                startTimestamp: BigNumber.from(round.periodOnStart[i]).add(
                    round.cliff
                ),
                duration: BigNumber.from(round.periodOnEnd[i]).sub(
                    BigNumber.from(round.periodOnStart[i])
                ),
                linearUnits: BigNumber.from(round.periodLinUnit[i]),
                percentageD: ONE.mul(100)
                    .mul(round.periodAmount[i])
                    .div(round.totalAmount),
            } as Period)

            percentageSum = percentageSum.add(
                ONE.mul(100).mul(round.periodAmount[i]).div(round.totalAmount)
            )
        }

        advancedPeriods.push({
            startTimestamp: BigNumber.from(
                round.periodOnStart[round.periodOnStart.length - 1]
            ).add(round.cliff),
            duration: BigNumber.from(
                round.periodOnEnd[round.periodOnStart.length - 1]
            ).sub(
                BigNumber.from(
                    round.periodOnStart[round.periodOnStart.length - 1]
                )
            ),
            linearUnits: BigNumber.from(
                round.periodLinUnit[round.periodOnStart.length - 1]
            ),
            percentageD: ONE.mul(100).sub(percentageSum),
        } as Period)

        rounds.push({
            name: round.name,
            periods: advancedPeriods,
        } as Round)
    })

    return rounds
}

export const getNewSetupedVesting = async (
    startTimestamp: number,
    root: string,
    round: Round[]
) => {
    const [owner] = await ethers.getSigners()
    const { vestingFactory, tokenFactory } = await useContractsFactory()

    const token = await tokenFactory.deploy()
    await token.deployed()

    const vesting = await vestingFactory.deploy(token.address, owner.address)
    await vesting.deployed()

    let totalTokens: BigNumber = BigNumber.from(0)

    for (const al of allocations as User[])
        for (const n of al[0]) totalTokens = totalTokens.add(n)

    await vesting
        .connect(owner)
        .init(startTimestamp, 'leaves.link', root, round)
    await token.connect(owner).transfer(vesting.address, totalTokens)

    return { token, vesting }
}

export const now = async () =>
    (await ethers.provider.getBlock(await ethers.provider.getBlockNumber()))
        .timestamp

export const randomPercent = () => Math.floor(Math.random() * 100)
