import Web3 from "web3";
import {
  web3Loaded,
  web3AccountLoaded,
  marketplaceLoaded,
  ticketsLoaded,
  saleToggling,
  saleToggled,
  ticketPriceChanging,
  ticketPriceChanged,
} from "./actions";
import Marketplace from "../contracts-json/Marketplace.json";
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

  // console.log("IPFS hash: ", result.path);
  // console.log("!!!account", account);
  await marketplace.methods
    // .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
    .createTicket(web3.utils.toWei(price, "ether"), result.path)
    .send({ from: account });
  console.log("Ticket created successfully!");

  //const num_tickets = await marketplace.methods.getOnSaleLength().call();
  //console.log("!!!!!num_tickets", num_tickets);
};

export const loadAllTickets = async (marketplace, dispatch) => {
  const myTickets = [];
  const items = [];

  const num_tickets = await marketplace.methods.getTicketsLength().call();
  // console.log("!!!!!num_tickets", num_tickets);
  var uri, data, item, myTicket, ticket;
  for (let i = 0; i < num_tickets; i++) {
    ticket = await marketplace.methods.tickets(i).call();
    //onSale = ticket.onSale;
    //owner = await marketplace.methods.owners(i).call();
    //if (owner == this.account) this.myTickets.push(i);
    uri = await marketplace.methods.tokenURI(i).call();
    try {
      data = await axios.get(uri);
      myTicket = data.data;
      myTicket.ticket_id = i;
      myTicket.on_sale = ticket.onSale;
      myTickets.push(myTicket);
      // if (owner == this.account) {
      //   myTicket = data.data;
      //   myTicket.ticket_id = i;
      //   myTicket.on_sale = await this.contract.methods.onSale(i).call();
      //   this.state.myTickets.push(myTicket);
      // } else {
      //   item = data.data;
      //   item.ticket_id = i;
      //   item.on_sale = await this.contract.methods.onSale(i).call();
      //   console.log(item);
      //   this.state.items.push(item);
      // }
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

  console.log("!!!!! IPFS result: ", result);

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

// async changeTicketPrice(id, price) {
//   let uri = await this.contract.methods.tokenURI(id).call();
//   var item;
//   try {
//     let data = await axios.get(uri);
//     item = data.data;
//     item.ticket_value = price;
//     console.log(item);
//   } catch (error) {
//     console.log(error);
//   }
//   let result = await ipfs.add(JSON.stringify(item));
//   console.log("IPFS hash: ", result.path);
//   await this.contract.methods.changeTicketPrice(id, web3.utils.toWei(price,'ether'), result.path).send({from:this.account});
//   console.log("Ticket price changed successfully!");
// },

// export const makeBuyOrder = (dispatch, exchange, token, web3, order, account) => {
//   const tokenGet = token.options.address
//   const amountGet = web3.utils.toWei(order.amount, 'ether')
//   const tokenGive = ETHER_ADDRESS
//   const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether')

//   exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
//   .on('transactionHash', (hash) => {
//     dispatch(buyOrderMaking())
//   })
//   .on('error',(error) => {
//     console.error(error)
//     window.alert(`There was an error!`)
//   })
// }

export const subscribeToEvents = async (web3, marketplace, dispatch) => {
  marketplace.events.saleToggled({}, (error, event) => {
    dispatch(saleToggled(event.returnValues));
  });
  marketplace.events.ticketPriceChanged({}, (error, event) => {
    console.log("!!!!!event.returnValues,", event.returnValues);
    let ticket = {
      ticket_id: event.returnValues._id,
      _newPrice: web3.utils.fromWei(event.returnValues._newPrice),
      _tokenURI: event.returnValues._tokenURI,
    };
    dispatch(ticketPriceChanged(ticket));
  });
};

//   console.log("!!!!!this.state.myTickets", this.state.myTickets);
// }
