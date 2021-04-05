# Blockchain Ticketing System

This repository contains the implementation of a fully-functioning blockchain ticketing system on Ethereum-based blockchain. For faster transaction time, deploy smart contracts on sidechains such as Matic network. 

### Getting Started

Prerequisites: solidity, truffle and npm installed 

To test smart contracts, first start ganache and run `truffle test`. To see the coverage achieved by the unit tests, run `truffle run coverage`. The coverage report is added to the `coverage` directory. 

To deploy smart contracts, run `truffle migrate --network ropsten`. Change `ropsten` to the network that you want to deploy the smart contracts to. You could add custom networks in the truffle-config.js file. 

Once the contracts are deployed, you could connect to the smart contract using the user interface provided. Get the deployed smart contract address and change the corresponding value in `app/Vue.js`.
```
cd app
yarn serve
```

By default, the user interface runs on localhost:8080 and you can open up this port on a web browser. 

### Identity Management System 

This repository also contains a self sovereign identity (SSI) system which verifies the identity of ticket buyers. It uses the Hyperledger Aries framework. Further instructions to launch the identity management system can be found in the `identity` directory.

### Tickets Verification Mechanism System 

A singature-based tickets verification mechanism is implemented to prove tickets ownership at event's entrance. To launch the user interface for the ticket verifier, run
``` 
cd verifier
yarn serve
```

Open up the user interface on a web browser. 


