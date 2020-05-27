pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketsFactory is Ownable{

  struct Ticket {
    uint32 identifier;
    string seatNumber;
  }

  //@dev list of tickets for the event, with index of tickets as its id
  Ticket[] public tickets;

  mapping(uint => address) public ticketToOwner; //maps ticket id to owner (id starts from zero)

  event ticketCreated(uint32 _identifier, address _owner);

  function createTickets(uint32 _identifier, string memory _seatNumber) public onlyOwner {
    tickets.push(Ticket(_identifier, _seatNumber));
    ticketToOwner[tickets.length-1] = msg.sender;
    emit ticketCreated(_identifier, msg.sender);
  }

}
