/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type { ERC20, ERC20Interface } from '../ERC20'

const _abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const _bytecode =
  '0x60806040523480156200001157600080fd5b5060405162000db338038062000db383398101604081905262000034916200018a565b600362000042838262000302565b50600462000051828262000302565b505050620003d2565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b03821117156200009857620000986200005a565b6040525050565b6000620000ab60405190565b9050620000b9828262000070565b919050565b60006001600160401b03821115620000da57620000da6200005a565b601f19601f83011660200192915050565b60005b8381101562000108578181015183820152602001620000ee565b50506000910152565b6000620001286200012284620000be565b6200009f565b905082815260208101848484011115620001455762000145600080fd5b62000152848285620000eb565b509392505050565b600082601f830112620001705762000170600080fd5b81516200018284826020860162000111565b949350505050565b60008060408385031215620001a257620001a2600080fd5b82516001600160401b03811115620001bd57620001bd600080fd5b620001cb858286016200015a565b92505060208301516001600160401b03811115620001ec57620001ec600080fd5b620001fa858286016200015a565b9150509250929050565b634e487b7160e01b600052602260045260246000fd5b6002810460018216806200022f57607f821691505b60208210810362000244576200024462000204565b50919050565b60006200025b620002588381565b90565b92915050565b6200026c836200024a565b815460001960089490940293841b1916921b91909117905550565b60006200029681848462000261565b505050565b81811015620002ba57620002b160008262000287565b6001016200029b565b5050565b601f82111562000296576000818152602090206020601f85010481016020851015620002e75750805b620002fb6020601f8601048301826200029b565b5050505050565b81516001600160401b038111156200031e576200031e6200005a565b6200032a82546200021a565b62000337828285620002be565b6020601f8311600181146200036e5760008415620003555750858201515b600019600886021c1981166002860217865550620003ca565b600085815260208120601f198616915b82811015620003a057888501518255602094850194600190920191016200037e565b86831015620003bd5784890151600019601f89166008021c191682555b6001600288020188555050505b505050505050565b6109d180620003e26000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461011f57806370a082311461013257806395d89b411461015b578063a457c2d714610163578063a9059cbb14610176578063dd62ed3e1461018957600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ec57806323b872dd146100fd578063313ce56714610110575b600080fd5b6100b661019c565b6040516100c39190610583565b60405180910390f35b6100df6100da3660046105df565b61022e565b6040516100c39190610626565b6002545b6040516100c3919061063a565b6100df61010b366004610648565b610248565b60126040516100c391906106a1565b6100df61012d3660046105df565b61026c565b6100f06101403660046106af565b6001600160a01b031660009081526020819052604090205490565b6100b661028e565b6100df6101713660046105df565b61029d565b6100df6101843660046105df565b6102e3565b6100f06101973660046106d8565b6102f1565b6060600380546101ab90610721565b80601f01602080910402602001604051908101604052809291908181526020018280546101d790610721565b80156102245780601f106101f957610100808354040283529160200191610224565b820191906000526020600020905b81548152906001019060200180831161020757829003601f168201915b5050505050905090565b60003361023c81858561031c565b60019150505b92915050565b6000336102568582856103d0565b61026185858561041a565b506001949350505050565b60003361023c81858561027f83836102f1565b6102899190610763565b61031c565b6060600480546101ab90610721565b600033816102ab82866102f1565b9050838110156102d65760405162461bcd60e51b81526004016102cd906107bb565b60405180910390fd5b610261828686840361031c565b60003361023c81858561041a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166103425760405162461bcd60e51b81526004016102cd9061080c565b6001600160a01b0382166103685760405162461bcd60e51b81526004016102cd9061085b565b6001600160a01b0380841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906103c390859061063a565b60405180910390a3505050565b60006103dc84846102f1565b9050600019811461041457818110156104075760405162461bcd60e51b81526004016102cd9061086b565b610414848484840361031c565b50505050565b6001600160a01b0383166104405760405162461bcd60e51b81526004016102cd906108e8565b6001600160a01b0382166104665760405162461bcd60e51b81526004016102cd90610938565b6001600160a01b0383166000908152602081905260409020548181101561049f5760405162461bcd60e51b81526004016102cd9061098b565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906104d6908490610763565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610520919061063a565b60405180910390a3610414565b60005b83811015610548578181015183820152602001610530565b50506000910152565b600061055b825190565b80845260208401935061057281856020860161052d565b601f01601f19169290920192915050565b602080825281016105948184610551565b9392505050565b60006001600160a01b038216610242565b6105b58161059b565b81146105c057600080fd5b50565b8035610242816105ac565b806105b5565b8035610242816105ce565b600080604083850312156105f5576105f5600080fd5b600061060185856105c3565b9250506020610612858286016105d4565b9150509250929050565b8015155b82525050565b60208101610242828461061c565b80610620565b602081016102428284610634565b60008060006060848603121561066057610660600080fd5b600061066c86866105c3565b935050602061067d868287016105c3565b925050604061068e868287016105d4565b9150509250925092565b60ff8116610620565b602081016102428284610698565b6000602082840312156106c4576106c4600080fd5b60006106d084846105c3565b949350505050565b600080604083850312156106ee576106ee600080fd5b60006106fa85856105c3565b9250506020610612858286016105c3565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061073557607f821691505b6020821081036107475761074761070b565b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156102425761024261074d565b602581526000602082017f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77815264207a65726f60d81b602082015291505b5060400190565b6020808252810161024281610776565b602481526000602082017f45524332303a20617070726f76652066726f6d20746865207a65726f206164648152637265737360e01b602082015291506107b4565b60208082528101610242816107cb565b602281526000602082017f45524332303a20617070726f766520746f20746865207a65726f206164647265815261737360f01b602082015291506107b4565b602080825281016102428161081c565b6020808252810161024281601d81527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000602082015260400190565b602581526000602082017f45524332303a207472616e736665722066726f6d20746865207a65726f206164815264647265737360d81b602082015291506107b4565b60208082528101610242816108a6565b602381526000602082017f45524332303a207472616e7366657220746f20746865207a65726f206164647281526265737360e81b602082015291506107b4565b60208082528101610242816108f8565b602681526000602082017f45524332303a207472616e7366657220616d6f756e7420657863656564732062815265616c616e636560d01b602082015291506107b4565b602080825281016102428161094856fea26469706673582212209718cc6551b871bb1f246b8ab31707bf39a381848cec911ef805a04df0b2ab0764736f6c63430008120033'

export class ERC20__factory extends ContractFactory {
  constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0])
    } else {
      super(...args)
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ERC20> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC20>
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {})
  }
  attach(address: string): ERC20 {
    return super.attach(address) as ERC20
  }
  connect(signer: Signer): ERC20__factory {
    return super.connect(signer) as ERC20__factory
  }
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): ERC20Interface {
    return new utils.Interface(_abi) as ERC20Interface
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC20 {
    return new Contract(address, _abi, signerOrProvider) as ERC20
  }
}
