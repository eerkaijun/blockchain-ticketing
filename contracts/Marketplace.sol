pragma solidity >=0.6.0 <0.7.0;

import "./TicketsFactory.sol";

contract Marketplace is TicketsFactory {

  uint private _maxTicketNum;
  uint private _ticketPrice;

  constructor() public {
    _maxTicketNum = 10;
    _ticketPrice = 3 ether;
  }

  function withdraw() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable {
    require(msg.value >= _ticketPrice);
    _transferTicket(_tokenId);
  }

  function _transferTicket(uint256 _tokenId) private {
    address seller = ownerOf(_tokenId);
    require(balanceOf(msg.sender) <= _maxTicketNum, "exceeded max number of tickets bought");
    safeTransferFrom(seller, msg.sender, _tokenId); // need to make sure msg.sender is first added to approved list
  }

}
