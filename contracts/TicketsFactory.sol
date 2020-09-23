pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketsFactory is Ownable{

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
  }

}
