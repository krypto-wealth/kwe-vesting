import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import 'module-alias/register'

import '@/gotbit-tools/hardhat/init'
import { genNetworks, genCompilers } from '@/gotbit-tools/hardhat'

task('accounts', 'Prints the list of accounts', async (_, hre) => {
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
        console.log(account.address)
    }
})

const config: HardhatUserConfig = {
    solidity: {
        compilers: genCompilers(['0.8.15', '0.6.6', '0.8.18']),
    },
    networks: {
        hardhat: {
            tags: ['localhost'],
            deploy: ['deploy/localhost/'],

            // tags: ['fork'],
            // deploy: ['deploy/fork/'],
            // forking: {
            //   url: 'https://rpc.ankr.com/bsc',
            // },
        },
        ...genNetworks(),
        // place here any network you like (for overriding `genNetworks`)
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
    },
}

export default config
