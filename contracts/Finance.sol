// SPDX-License-Identifier: MIT
// curren deployed address on Shibuya: 0x5D1ce7Fb931274Aa315707aEB2abAD9D138780FA

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

abstract contract MarketplaceInterface {
    function getEventStarted() public virtual view returns(bool); 
}

contract Finance is Ownable {
    
    using SafeMath for uint;
    
    address marketplaceAddress = 0xd9145CCE52D386f254917e481eB44e9943F39138; 
    MarketplaceInterface marketplaceContract = MarketplaceInterface(marketplaceAddress);
    
    uint public investmentPrice;
    uint public totalInvestment; // total shares that are released
    uint private _investmentSold = 0;
    mapping(address=>uint) public investors; // mapping to show number of shares owned by each investor
    bool retrieved; 
    uint public inVault; // funds that are deposited into vault from ticket sales
    
    // let's say the event organiser will have 100 tickets as Collateral
    // each ticket will cost $100 in the primary market
    // for each ticket sold, $40 will be put into a vault (40%)
    // total collateral worth $40 x 100 (if sold out) = $4000
    // and now the event organiser wants to pre finance $3000
    // so the event organiser will sell each collateral at $30 until 100 collateral has been sold
    constructor() {
        investmentPrice = 30;
        totalInvestment = 100;
    }
    
    receive() external payable {}
    
    // investors can choose to invest in a number of tokens
    function invest(uint _number) public payable {
        require(msg.value == investmentPrice.mul(_number));
        require(_number + _investmentSold < totalInvestment);
        _incrementInvestmentId(_number);
        investors[msg.sender] += _number;
    }
    
    function _incrementInvestmentId(uint _number) private {
        _investmentSold = _investmentSold + _number;
    }
    
    // event organiser can withdraw funds before the event starts
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function retrieve() public {
        require(marketplaceContract.getEventStarted() == true);
        if (!retrieved) {
            retrieved = true;
            inVault = address(this).balance;
        }
        payable(msg.sender).transfer(inVault.div(totalInvestment).mul(investors[msg.sender]));
        investors[msg.sender] = 0;
    }
    
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }
}