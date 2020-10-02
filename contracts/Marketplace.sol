pragma solidity >=0.6.0 <0.7.0;

import "./TicketsFactory.sol";

contract Marketplace is TicketsFactory {

  mapping (address => uint256) etherBalance;
  uint private _maxTicketNum;
  uint private _ticketPrice;

  constructor() public {
    _maxTicketNum = 10;
    _ticketPrice = 3 ether;
  }

  function withdraw() public {
    msg.sender.transfer(etherBalance[msg.sender]);
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable {
    require(msg.value >= _ticketPrice);
    require(balanceOf(msg.sender) <= _maxTicketNum, "exceeded max number of tickets bought");
    address seller = ownerOf(_tokenId);
    _safeTransfer(seller, msg.sender, _tokenId, "");
    etherBalance[seller] += msg.value;
    emit ticketTransferred(_tokenId, msg.sender);
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner

}
