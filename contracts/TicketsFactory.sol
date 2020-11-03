pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketsFactory is Ownable, ERC721{

  uint256 private _currentTokenId = 0;
  mapping (uint256 => uint256) public ticketPrice;
  //mapping (uint256 => bool) onSale;
  bool[] public onSale;
  address[] public owners;

  constructor() ERC721("NFT Tickets", "TIX") public {
  }

  function createTicket(uint256 _price) public onlyOwner {
    //uint256 newTokenId = _getNextTokenId();
    _mint(msg.sender, _currentTokenId); //token id starts from 0
    ticketPrice[_currentTokenId] = _price;
    onSale.push(false);
    owners.push(msg.sender);
    _setTokenURI(_currentTokenId, ""); // to be added a proper URI for IPFS
    _incrementTokenId();
  }

  function changeTicketPrice(uint256 _tokenId, uint256 _price) public onlyOwner {
    ticketPrice[_tokenId] = _price;
  }

  function getOnSaleLength() public view returns(uint) {
    return onSale.length;
  }

  function getOwnersLength() public view returns(uint) {
    return owners.length;
  }

  /*
  function _getNextTokenId() private view returns (uint256) {
    return _currentTokenId.add(1);
  }*/

  function _incrementTokenId() private  {
    _currentTokenId++;
  }

}
