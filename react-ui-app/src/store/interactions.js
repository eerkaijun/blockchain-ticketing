import Web3 from "web3";
import {
  web3Loaded,
  web3AccountLoaded,
  marketplaceLoaded,
  marketplaceStateChanged,
  investmentSoldChanged,
  investorUnitsChanged,
  numTicketsLoaded,
  ticketsLoaded,
  saleToggling,
  saleToggled,
  ticketCreating,
  ticketCreated,
  ticketPriceChanging,
  ticketPriceChanged,
  ticketBuying,
  ticketBouhgt,
} from "./actions";
import Marketplace from "../contracts-json/Marketplace.json";
import { MARKETPLACE_STATES } from "../hardcodedConstants";
// import Exchange from "../abis/Exchange.json";
// import { ETHER_ADDRESS } from "../helpers";

// const ipfsClient = require("ipfs-http-client");

const ipfs = require("ipfs-http-client")({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
const axios = require("axios");

export const loadWeb3 = async (dispatch) => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      await window.ethereum.enable();
      dispatch(web3Loaded(web3));
      return web3;
    } catch (error) {
      // User denied account access...
      alert("Please connect Metamask to the site");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    const web3 = new Web3(web3.currentProvider);
    dispatch(web3Loaded(web3));
    return web3;
  }
  // Non-dapp browsers...
  else {
    window.alert("Please install MetaMask");
    window.location.assign("https://metamask.io/");
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(web3AccountLoaded(account));
  return account;
};

export const loadMarketplace = async (web3, networkID, dispatch) => {
  try {
    const marketplace = await new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkID].address
    );
    dispatch(marketplaceLoaded(marketplace));
    // console.log("!!!!marketplace", marketplace);
    return marketplace;
  } catch (error) {
    console.log(
      "Contract not deployed to the current network. Please select another network with Metamask."
    );
    return null;
  }
};

export const createTicket = async (
  price,
  seat,
  category,
  marketplace,
  account,
  web3,
  dispatch
) => {
  let metadata = {
    seat_number: seat,
    ticket_category: category,
    ticket_value: price,
  };
  // console.log(JSON.stringify(metadata));
  let result = await ipfs.add(JSON.stringify(metadata));
  let maxPrice = parseInt(price) * 1.1;
  // console.log("IPFS hash: ", result.path);
  // console.log("!!!account", account);
  await marketplace.methods
    // .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
    .createTicket(
      web3.utils.toWei(price, "ether"),
      web3.utils.toWei(maxPrice.toString(), "ether"),
      result.path
    )
    .send({ from: account });
  // .on("transactionHash", (hash) => {
  //   dispatch(ticketCreating());
  // })
  // .on("error", (error) => {
  //   console.log(error);
  //   window.alert("There was an error!");
  // });
  console.log("Ticket created successfully!");

  //const num_tickets = await marketplace.methods.getOnSaleLength().call();
  //console.log("!!!!!num_tickets", num_tickets);
};

export const loadMarketplaceState = async (marketplace, dispatch) => {
  //TODO: create enum with marketplase.State
  //   enum State { creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart }
  // 0 = creatingTickets 1 = investmentStart... etc

  const marketplaceStateNum = await marketplace.methods.currentState
    .call((err, res) => res)
    .call();
  const marketplaceStateStr = Object.keys(MARKETPLACE_STATES).find(
    (key) => MARKETPLACE_STATES[key] == marketplaceStateNum
  );
  const marketplaceState = [marketplaceStateNum, marketplaceStateStr];

  // console.log("!!!!!marketplaceState ", marketplaceState);

  dispatch(marketplaceStateChanged(marketplaceState));
};

export const loadInvestorUnits = async (marketplace, account, dispatch) => {
  // console.log("!!!!!web3 ", web3);
  const investorUnits = await marketplace.methods
    .investors(account)
    // .investors("0x80BC2298872D8C88f0Eca80fA1a63953Ac3093F8")

    .call((err, res) => res);

  // console.log("!!!!!investorUnits ", investorUnits);

  dispatch(investorUnitsChanged(investorUnits));
};

export const loadInvestmentSold = async (marketplace, dispatch) => {
  // const investmentSold = await marketplace.methods._investmentSold;
  const investmentSold = await marketplace.methods._investmentSold
    .call((err, res) => res)
    .call();

  // console.log("!!!!!investmentSold ", investmentSold);

  dispatch(investmentSoldChanged(investmentSold));
};

export const loadAllTickets = async (marketplace, dispatch) => {
  const myTickets = [];
  const items = [];

  const num_tickets = await marketplace.methods.getTicketsLength().call();
  dispatch(numTicketsLoaded(num_tickets));
  // const num_tickets = 1;
  // console.log("!!!!!num_tickets", num_tickets);
  var uri, data, item, myTicket, ticket;
  for (let i = 0; i < num_tickets; i++) {
    ticket = await marketplace.methods.tickets(i).call();

    uri = await marketplace.methods.tokenURI(i).call();
    try {
      data = await axios.get(uri);
      myTicket = data.data;
      myTicket.ticket_id = i;
      myTicket.on_sale = ticket.onSale;
      myTickets.push(myTicket);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log("!!!!!myTickets", myTickets);
  dispatch(ticketsLoaded(myTickets));
};

export const toggleSale = async (dispatch, marketplace, ticket, account) => {
  marketplace.methods
    .toggleSale(ticket.ticket_id)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(saleToggling(ticket));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startInvestment = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startInvestment()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when investmentStarted event is added to the smart contract
      // dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const stopInvestment = async (dispatch, marketplace, account) => {
  marketplace.methods
    .stopInvestment()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when investmentStarted event is added to the smart contract
      // dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startTicketSale = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startTicketSale()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when startTicketSale event is added to the smart contract
      // dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startEvent = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startEvent()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when startTicketSale event is added to the smart contract
      // dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const retrieve = async (dispatch, marketplace, account) => {
  marketplace.methods
    .retrieve()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when startTicketSale event is added to the smart contract
      // dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const buyTicket = async (
  dispatch,
  marketplace,
  web3,
  ticket,
  account
) => {
  marketplace.methods
    .buyTicket(ticket.ticket_id)
    // .send({ from: account, value: ticket.ticket_value })
    .send({
      from: account,
      // value: 2,
      // value: ticket.ticket_value,
      value: web3.utils.toWei(ticket.ticket_value, "ether"),
    })
    .on("transactionHash", (hash) => {
      // dispatch(saleToggling(ticket));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};
///////TODO instead of ticket.ticket_value call contract with  web3.utils.toWei(ticket.ticket_value,'ether'),
export const changeTicketPrice = async (
  dispatch,
  marketplace,
  web3,
  ticket,
  account
) => {
  let uri = await marketplace.methods.tokenURI(ticket.ticket_id).call();
  var item;
  try {
    let data = await axios.get(uri);
    item = data.data;
    item.ticket_value = ticket.ticket_value;
  } catch (error) {
    console.log(error);
  }
  let result = await ipfs.add(JSON.stringify(item));

  // console.log("!!!!! IPFS result: ", result);

  await marketplace.methods
    .changeTicketPrice(
      ticket.ticket_id,
      web3.utils.toWei(ticket.ticket_value, "ether"),
      result.path
    )
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(ticketPriceChanging(ticket));
    });
  console.log("Ticket price changed successfully!");
};
///////////////////////////

export const invest = async (
  dispatch,
  marketplace,
  web3,
  collateralUnits,
  account
) => {
  //TODO replace 3 with actual value of collateral unit price when it's ready in the smart contract
  const investValue = collateralUnits * 3;
  await marketplace.methods
    .invest(collateralUnits)
    // .send({ from: account, value: web3.utils.toWei("30", "ether") })
    .send({
      from: account,
      value: web3.utils.toWei(investValue.toString(), "ether"),
    })
    .on("transactionHash", (hash) => {
      // dispatch(investChanging());
    });
  console.log("invested successfully!");
};

export const subscribeToEvents = async (web3, marketplace, dispatch) => {
  marketplace.events.saleToggled({}, (error, event) => {
    dispatch(saleToggled(event.returnValues));
  });

  marketplace.events.ticketCreated({}, (error, event) => {
    console.log("!!!!marketplace.events.ticketCreated event: ", event);
    dispatch(ticketCreated(event.returnValues));
  });

  // marketplace.events.ticketPriceChanged({}, (error, event) => {
  //   console.log("!!!!!event.returnValues,", event.returnValues);
  //   let ticket = {
  //     ticket_id: event.returnValues._id,
  //     _newPrice: web3.utils.fromWei(event.returnValues._newPrice),
  //     _tokenURI: event.returnValues._tokenURI,
  //   };
  //   dispatch(ticketPriceChanged(ticket));
  // });
};

//   console.log("!!!!!this.state.myTickets", this.state.myTickets);
// }
