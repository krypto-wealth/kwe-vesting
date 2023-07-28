import { ethers } from 'hardhat'
import type { DeployFunction } from 'hardhat-deploy/types'
import { wrapperHRE } from '@/gotbit-tools/hardhat'

import type { Vesting__factory } from '@/typechain'

const func: DeployFunction = async (hre) => {
    const { deploy } = wrapperHRE(hre)
    const [deployer] = await ethers.getSigners()

    const token = await ethers.getContract('KWEToken')

    await deploy<Vesting__factory>('Vesting', {
        from: deployer.address,
        args: [token.address, deployer.address],
        log: true,
    })
}
export default func

func.tags = ['Vesting.deploy']
func.dependencies = ['KWEToken.deploy']
