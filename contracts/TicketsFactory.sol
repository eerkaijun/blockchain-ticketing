pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TicketsFactory is Ownable, ERC721{

  using SafeMath for uint;

  uint256 private _currentTokenId = 0;
  mapping (uint256 => uint256) public ticketPrice;
  mapping (uint256 => uint256) public originalTicketPrice;
  //mapping (uint256 => bool) onSale;
  bool[] public onSale;
  address[] public owners;

  constructor() ERC721("NFT Tickets", "TIX") public {
    _setBaseURI("https://ipfs.infura.io/ipfs/");
  }

  function createTicket(uint256 _price, string memory _tokenURI) public onlyOwner {
    //uint256 newTokenId = _getNextTokenId();
    _mint(msg.sender, _currentTokenId); //token id starts from 0
    ticketPrice[_currentTokenId] = _price;
    originalTicketPrice[_currentTokenId] = _price;
    onSale.push(false);
    owners.push(msg.sender);
    _setTokenURI(_currentTokenId, _tokenURI);
    _incrementTokenId();
  }

  function changeTicketPrice(uint256 _tokenId, uint256 _price, string memory _tokenURI) public {
    require(msg.sender == ownerOf(_tokenId));
    uint256 originalPrice = originalTicketPrice[_tokenId];
    require(_price < originalPrice.add(originalPrice.div(10)), "not more than 10% of original price");
    ticketPrice[_tokenId] = _price;
    _setTokenURI(_tokenId, _tokenURI);
  }

  function getOnSaleLength() public view returns(uint) {
    return onSale.length;
  }

  function getOwnersLength() public view returns(uint) {
    return owners.length;
  }

  function _incrementTokenId() private  {
    _currentTokenId++;
  }

}
