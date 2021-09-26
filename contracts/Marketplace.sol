// SPDX-License-Identifier: MIT
// curren deployed address on Shibuya: 0x5D1ce7Fb931274Aa315707aEB2abAD9D138780FA

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract Marketplace is Ownable, ERC721URIStorage{

  using SafeMath for uint;
  
  // metadata for each ticket
  struct Ticket {
      uint256 maxPrice; // maximum price cap on the ticket
      uint256 price; // current price
      bool onSale;
  }
  
  address public financeAddress; 

  uint256 private _currentTokenId = 0;
  Ticket[] public tickets; 
  bool eventStarted = false;
  mapping (address => uint256) etherBalance;
  uint public vaultBalance;
  uint private _maxTicketNum = 10;
  string private _base; 

  constructor() ERC721("NFT Tickets", "TIX") {
    _setBaseURI("https://ipfs.infura.io/ipfs/");
  }

  modifier eventNotStarted() {
    require(eventStarted == false);
    _;
  }
  
  function _setBaseURI(string memory _uri) private {
    _base = _uri; 
  }
  
  function _baseURI() internal view override returns (string memory) {
    return _base;
  }

  function createTicket(uint256 _price, uint256 _maxPrice, string memory _tokenURI) public onlyOwner {
    _mint(msg.sender, _currentTokenId); //token id starts from 0
    tickets.push(Ticket(_maxPrice, _price, false));
    _setTokenURI(_currentTokenId, _tokenURI);
	emit ticketCreated(_currentTokenId, _price, _tokenURI);
    _incrementTokenId();
  }

  function changeTicketPrice(uint256 _tokenId, uint256 _newPrice, string memory _tokenURI) public {
    require(msg.sender == ownerOf(_tokenId));
    Ticket storage tix = tickets[_tokenId];
    require(_newPrice < tix.maxPrice, "not more than the upper limit price");
    tix.price = _newPrice;
    _setTokenURI(_tokenId, _tokenURI);
  }

  function startEvent() public onlyOwner {
    eventStarted = true;
  }
  
  function getEventStarted() public view returns(bool) {
    return eventStarted;
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
    etherBalance[seller] += (msg.value).div(5).mul(3);
    vaultBalance += (msg.value).div(5).mul(2);
    //payable(financeAddress).transfer((msg.value).div(5).mul(2)); // transfer 40% to the finance contract
    _safeTransfer(seller, msg.sender, _tokenId, "");
    emit ticketTransferred(_tokenId, msg.sender);
    emit saleToggled(_tokenId, false);
  }
  
  function transferToVault() public {
    payable(financeAddress).transfer(vaultBalance);
    vaultBalance = 0;
  }
  
  function setFinanceAddress(address _finance) public onlyOwner {
    financeAddress = _finance; 
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner
  event saleToggled(uint256 _id, bool state); //show whether ticket is on sale
  event ticketCreated(uint256 _id, uint256 _price, string _tokenURI);

}