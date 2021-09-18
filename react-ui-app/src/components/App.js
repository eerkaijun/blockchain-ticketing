import { Tabs, Tab, Button, Row, Col, Container, Table } from "react-bootstrap";
// import dBank from "../abis/dBank.json";
import React, { Component } from "react";
// import Token from "../abis/Token.json";
// import dbank from "../dbank.png";
import Web3 from "web3";
import "./App.css";
// TODO : look lesson 17 and setup truffle-config to put build to ./src directory
import Marketplace from "../abis/Marketplace.json";

//h0m3w0rk - add new tab to check accrued interest

const loadWeb3 = async (dispatch) => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      return web3;
      // Acccounts now exposed
      //web3.eth.sendTransaction({/* ... */});
    } catch (error) {
      // User denied account access...
      alert("Please connect Metamask to the site");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    const web3 = new Web3(web3.currentProvider);
    return web3;

    // Acccounts always exposed
    // web3.eth.sendTransaction({/* ... */});
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  console.log("!!!!account", account);
  // dispatch(web3AccountLoaded(account));
  return account;
};

function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

function web3AccountLoaded(account) {
  return {
    type: "WEB3_ACCOUNT_LOADED",
    account,
  };
}

//////////////////////

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    const web3 = await loadWeb3(dispatch);
    const networkId = await web3.eth.net.getId();
    await loadAccount(web3, dispatch);
    console.log("!!!!Marketplace ", Marketplace);
    // const token = await loadToken(web3, networkId, dispatch)
    // if(!token) {
    //   window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
    //   return
    // }
    // const exchange = await loadExchange(web3, networkId, dispatch)
    // if(!exchange) {
    //   window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
    //   return
    // }
  }
  async deposit(amount) {
    //check if this.state.dbank is ok
    //in try block call dBank deposit();
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: "undefined",
      account: "",
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null,
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <img src={dbank} className="App-logo" alt="logo" height="32" /> */}
            <b>dBank</b>
          </a>
        </nav>
        <Button>Bootstrap button</Button>
        <div className="container">
          <div className="row">
            <div className="col">Column</div>
            <div className="col">
              Column
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="col">Column</div>
          </div>
        </div>
      </div>

      // <div className="text-monospace">
      //   <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      //     <a
      //       className="navbar-brand col-sm-3 col-md-2 mr-0"
      //       href="http://www.dappuniversity.com/bootcamp"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       {/* <img src={dbank} className="App-logo" alt="logo" height="32" /> */}
      //       <b>dBank</b>
      //     </a>
      //   </nav>
      //   <div className="container-fluid mt-5 text-center">
      //     <br></br>
      //     <h1>{/*add welcome msg*/}add welcome msg</h1>
      //     <h2>{/*add user address*/}add user address hhhh</h2>
      //     <br></br>
      //     <div className="row">
      //       <main role="main" className="col-lg-12 d-flex text-center">
      //         <div className="content mr-auto ml-auto">
      //           <h2>here put the tickets table</h2>
      //           <div>just a div where the table would be</div>
      //         </div>
      //       </main>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default App;
