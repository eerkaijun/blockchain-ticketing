pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketsFactory is Ownable, ERC721{

  uint256 private _currentTokenId = 0;

  constructor() ERC721("NFT Tickets", "TIX") public {
  }

  function createTicket() public onlyOwner {
    uint256 newTokenId = _getNextTokenId();
    _mint(msg.sender, newTokenId); //token id starts from 1
    _incrementTokenId();
  }

  function _getNextTokenId() private view returns (uint256) {
    return _currentTokenId.add(1);
  }

  function _incrementTokenId() private  {
    _currentTokenId++;
  }

  /*
  // this metadata should probably be stored off chain -- IPFS
  struct Ticket {
    uint32 price;
    string seatNumber;
  }

  //@dev list of tickets for the event, with index of tickets as its id
  Ticket[] public tickets;

  mapping(uint => address) public ticketToOwner; //maps ticket id to owner (id starts from zero)
  // how to prevent other from editting this mapping

  event ticketCreated(uint _id, address _owner);

  // should be called recursively if to create multiple tickets
  function createTicket(uint32 _price, string memory _seatNumber) public onlyOwner {
    tickets.push(Ticket(_price, _seatNumber));
    uint id = tickets.length-1;
    ticketToOwner[id] = msg.sender;
    emit ticketCreated(id, msg.sender);
  }*/

}
