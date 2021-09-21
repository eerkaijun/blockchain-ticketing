import Web3 from "web3";
import {
  web3Loaded,
  web3AccountLoaded,
  marketplaceLoaded,
  exchangeLoaded,
  cancelledOrdersLoaded,
  filledOrdersLoaded,
  allOrdersLoaded,
  orderCancelling,
  orderCancelled,
  orderFilling,
  orderFilled,
  etherBalanceLoaded,
  tokenBalanceLoaded,
  exchangeEtherBalanceLoaded,
  exchangeTokenBalanceLoaded,
  balancesLoaded,
  balancesLoading,
  buyOrderMaking,
  sellOrderMaking,
  orderMade,
} from "./actions";
import Marketplace from "../contracts-json/Marketplace.json";
// import Exchange from "../abis/Exchange.json";
// import { ETHER_ADDRESS } from "../helpers";

// export const loadWeb3 = async (dispatch) => {
//   if(typeof window.ethereum!=='undefined'){
//     const web3 = new Web3(window.ethereum)
//     dispatch(web3Loaded(web3))
//     return web3
//   } else {
//     window.alert('Please install MetaMask')
//     window.location.assign("https://metamask.io/")
//   }
// }

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

  // //var self = this;
  // this.contract.events
  //   .saleToggled()
  //   .on("data", function (event) {
  //     console.log("EVENT INCOMING!!!");
  //     //self.initMarketplace(); //scope error
  //   })
  //   .on("connected", function (event) {
  //     console.log("Successfully subscribed to the event");
  //   })
  //   .on("error", console.error);
};

// async initMarketplace() {
//   this.state.myTickets = [];
//   this.state.items = [];

//   const num_tickets = await this.contract.methods.getOnSaleLength().call();
//   // console.log("!!!!!num_tickets", num_tickets);
//   var uri, data, item, myTicket, onSale, owner;
//   for (let i = 0; i < num_tickets; i++) {
//     onSale = await this.contract.methods.onSale(i).call();
//     owner = await this.contract.methods.owners(i).call();
//     //if (owner == this.account) this.myTickets.push(i);
//     uri = await this.contract.methods.tokenURI(i).call();
//     try {
//       data = await axios.get(uri);
//       if (owner == this.account) {
//         myTicket = data.data;
//         myTicket.ticket_id = i;
//         myTicket.on_sale = await this.contract.methods.onSale(i).call();
//         this.state.myTickets.push(myTicket);
//       } else {
//         item = data.data;
//         item.ticket_id = i;
//         item.on_sale = await this.contract.methods.onSale(i).call();
//         console.log(item);
//         this.state.items.push(item);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   console.log("!!!!!this.state.myTickets", this.state.myTickets);
// }
