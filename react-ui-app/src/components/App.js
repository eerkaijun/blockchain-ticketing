import React, { Component } from "react";
import { accountSelector, contractsLoadedSelector } from "../store/selectors";
import { connect } from "react-redux";
import { loadWeb3, loadAccount, loadMarketplace } from "../store/interactions";
import "./App.css";
import Navbar from "./Navbar";
import Content from "./Content";
// TODO : look lesson 17 and setup truffle-config to put build to ./src directory

const ipfsClient = require("ipfs-http-client");
const ipfs = require("ipfs-http-client")({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
const axios = require("axios");

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);

    // await this.createTicket("123", 8, 3);
    // await this.initMarketplace();
  }

  async createTicket(price, seat, category) {
    let metadata = {
      seat_number: seat,
      ticket_category: category,
      ticket_value: price,
    };
    console.log(JSON.stringify(metadata));
    let result = await ipfs.add(JSON.stringify(metadata));

    console.log("IPFS hash: ", result.path);
    await this.contract.methods
      .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
      .send({ from: this.account });
    console.log("Ticket created successfully!");

    const num_tickets = await this.contract.methods.getOnSaleLength().call();
    console.log("!!!!!num_tickets", num_tickets);
  }

  async loadBlockchainData(dispatch) {
    const web3 = await loadWeb3(dispatch);
    await loadAccount(web3, dispatch);
    const networkId = await web3.eth.net.getId();
    const marketplace = await loadMarketplace(web3, networkId, dispatch);
    if (!marketplace) {
      window.alert(
        "Marketplace smart contract not detected on the current network. Please select another network with Metamask."
      );
      return;
    }
    // await loadAllTickets(marketplace);
  }

  render() {
    return (
      <div>
        <Navbar />
        {this.props.contractsLoaded ? (
          <Content />
        ) : (
          <div className="content"></div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    contractsLoaded: contractsLoadedSelector(state),
  };
}

// export default App;
export default connect(mapStateToProps)(App);
