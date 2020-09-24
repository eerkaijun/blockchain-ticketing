pragma solidity >=0.6.0 <0.7.0;

import "./TicketsFactory.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace is TicketsFactory {

  uint private _maxTicketNum;
  uint private _ticketPrice;

  constructor() public {
    _maxTicketNum = 10;
    _ticketPrice = 3 ether; 
  }

  function buyTicket(uint256 _tokenId) external payable {
    require(msg.value >= _ticketPrice);
    _transferTicket(_tokenId);
  }

  //Primary marketplace

  // this function should be called by the buyer (should be a private function called by another function)
  function _transferTicket(uint256 _tokenId) private {
    address seller = ownerOf(_tokenId);
    require(balanceOf(msg.sender) <= _maxTicketNum, "exceeded max number of tickets bought");
    safeTransferFrom(seller, msg.sender, _tokenId); // need to make sure msg.sender is first added to approved list
  }

  /*
  uint resellAdditionalPrice; //upper limit of the resell price
  //uint maxTicketNum; //upper limit of how many tickets one can buy

  constructor() public {
    resellAdditionalPrice = 0.01 ether;
    //maxTicketNum = 10;
  }

  //Available function: setApprovalForAll(address to, bool approved)

  //Primary marketplace

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable {
    Ticket memory ticket = tickets[_tokenId];
    //address seller = ticketToOwner[_tokenId];
    require(msg.value == ticket.price, "payment failed");
    //require(balanceOf(msg.sender) <= maxTicketNum, "not enough balance");
    //safeTransferFrom(seller, msg.sender, _tokenId); // need to make sure msg.sender is first added to approved list
    ticketToOwner[_tokenId] = msg.sender;
  }

  //Secondary Marketplace

  // this function should be called by the buyer
  function transferTicket(uint256 _tokenId) external payable {
    Ticket memory ticket = tickets[_tokenId];
    //address seller = ticketToOwner[_tokenId];
    require(msg.value >= ticket.price && msg.value < ticket.price + resellAdditionalPrice); //restriction on upper limit of resold price
    //safeTransferFrom(seller, msg.sender, _tokenId); // need to make sure msg.sender is first added to approved list
    ticketToOwner[_tokenId] = msg.sender;
  }
  */


}
