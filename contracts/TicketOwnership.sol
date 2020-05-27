pragma solidity >=0.6.0 <0.7.0;

import "./TicketsFactory.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketOwnership is TicketsFactory, ERC721 {

  uint price;

  constructor() ERC721("NFT Ticket", "TIX") public {
    price = 0.001 ether;
  }

  function changeTicketPrice(uint _price) external onlyOwner {
    price = _price;
  }

  function buyTicket(address _from, address _to, uint256 _tokenId) external payable {
    require(msg.value == price);
    safeTransferFrom(_from, _to, _tokenId);
    ticketToOwner[_tokenId] = _to;
  }

  /* Available methods:
   * ownerOf(tokenId);
   * balanceOf(address);
   * approve(to, tokenId)
  */

}
