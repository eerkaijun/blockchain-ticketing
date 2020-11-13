// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

contract TicketsFactory is Ownable, ERC721, BaseRelayRecipient, IKnowForwarderAddress{

  uint256 private _currentTokenId = 0;
  mapping (uint256 => uint256) public ticketPrice;
  //mapping (uint256 => bool) onSale;
  bool[] public onSale;
  address[] public owners;

  constructor() ERC721("NFT Tickets", "TIX") public {
    trustedForwarder = 0x25CEd1955423BA34332Ec1B60154967750a0297D; //ropsten trusted forwarder address
  }

  function createTicket(uint256 _price) public onlyOwner {
    //uint256 newTokenId = _getNextTokenId();
    _mint(_msgSender(), _currentTokenId); //token id starts from 0
    ticketPrice[_currentTokenId] = _price;
    onSale.push(false);
    owners.push(_msgSender());
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

  function _incrementTokenId() private  {
    _currentTokenId++;
  }

  function versionRecipient() external virtual view override returns (string memory) {
		return "1.0";
	}

  function getTrustedForwarder() public view override returns(address) {
		return trustedForwarder;
	}

  function _msgData() internal override(Context, BaseRelayRecipient) view returns (bytes memory ret) {
    return BaseRelayRecipient._msgData();
  }

  function _msgSender() internal override(Context, BaseRelayRecipient) view returns (address payable) {
    return BaseRelayRecipient._msgSender();
  }

}
