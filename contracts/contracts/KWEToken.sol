//SPDX-License-Identifier: MIT
pragma solidity =0.8.15;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * @title KWEToken
 * @author gotbit
 */

contract KWEToken is ERC20 {
    constructor() ERC20('KWE Network', 'KWE') {
        _mint(msg.sender, 300_000_000 ether);
    }
}
