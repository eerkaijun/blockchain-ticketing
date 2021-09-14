// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract Marketplace is Ownable, ERC721{

  using SafeMath for uint;
  
  // metadata for each ticket
  struct Ticket {
      uint256 maxPrice; // maximum price cap on the ticket
      uint256 price; // current price
      bool onSale;
  }

  uint256 private _currentTokenId = 0;
  Ticket[] public tickets; 
  bool eventStarted = false;
  mapping (address => uint256) etherBalance;
  uint private _maxTicketNum = 10;

  constructor() ERC721("NFT Tickets", "TIX") {
    
  }

  modifier eventNotStarted() {
    require(eventStarted == false);
    _;
  }

  function createTicket(uint256 _price, uint256 _maxPrice) public onlyOwner {
    _mint(msg.sender, _currentTokenId); //token id starts from 0
    tickets.push(Ticket(_maxPrice, _price, false));
    _incrementTokenId();
  }

  function changeTicketPrice(uint256 _tokenId, uint256 _newPrice) public {
    require(msg.sender == ownerOf(_tokenId));
    Ticket storage tix = tickets[_tokenId];
    require(_newPrice < tix.maxPrice, "not more than the upper limit price");
    tix.price = _newPrice;
  }

  function startEvent() public onlyOwner {
    eventStarted = true;
  }

  function _incrementTokenId() private {
    _currentTokenId++;
  }
  
  function withdraw() public {
    payable(msg.sender).transfer(etherBalance[msg.sender]);
  }

  // tickets need to put on sale first before it could be purchased
  function toggleSale(uint256 _tokenId) public {
    require(msg.sender == ownerOf(_tokenId));
    Ticket storage tix = tickets[_tokenId];
    tix.onSale = !tix.onSale;
    emit saleToggled(_tokenId, tix.onSale);
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable eventNotStarted {
    Ticket storage tix = tickets[_tokenId];
    require(tix.onSale == true);
    require(msg.value >= tix.price, "at least the ticket price");
    require(balanceOf(msg.sender) < _maxTicketNum, "exceeded max number of tickets bought");
    address seller = ownerOf(_tokenId);
    tix.onSale = false;
    etherBalance[seller] += msg.value;
    _safeTransfer(seller, msg.sender, _tokenId, "");
    emit ticketTransferred(_tokenId, msg.sender);
    emit saleToggled(_tokenId, false);
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner
  event saleToggled(uint256 _id, bool state); //show whether ticket is on sale

}