// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "./TicketsFactory.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Marketplace is TicketsFactory{

  using SafeMath for uint;
  mapping (address => uint256) etherBalance;
  uint private _maxTicketNum;

  constructor() public {
    _maxTicketNum = 10;
  }

  function withdraw() public {
    _msgSender().transfer(etherBalance[_msgSender()]);
  }

  // tickets need to put on sale first before it could be purchased
  function toggleSale(uint256 _tokenId) public {
    require(_msgSender() == ownerOf(_tokenId));
    onSale[_tokenId] = !onSale[_tokenId];
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable {
    uint256 price = ticketPrice[_tokenId];
    require(onSale[_tokenId] == true);
    require(msg.value >= price, "at least the ticket price");
    require(msg.value < price.add(price.div(10)), "not more than 10% of original price");
    require(balanceOf(_msgSender()) <= _maxTicketNum, "exceeded max number of tickets bought");
    address seller = ownerOf(_tokenId);
    _safeTransfer(seller, _msgSender(), _tokenId, "");
    onSale[_tokenId] = false;
    etherBalance[seller] += msg.value;
    owners[_tokenId] = _msgSender();
    emit ticketTransferred(_tokenId, _msgSender());
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner

}
