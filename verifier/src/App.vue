<template>
  <v-app>
    <v-card>
      <v-card-title>
        Tickets Verification
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="signature" label="Please enter signature"></v-text-field>
          <v-text-field v-model="message" label="Please enter random message"></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn v-on:click="verifySignature(message, signature)" color="blue">Verify</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>Entrance Access</v-card-title>
        <v-card-text>The number of tickets owned is {{ticketsOwned}} tickets.</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script language="javascript" type="text/javascript" src="jslibs/web3.min.js"></script>
<script>

import MarketplaceABI from './plugins/Marketplace';
const Web3 = require('web3');

export default {
  name: 'App',
  data () {
    return {
      contract: null,
      account: '0x0',
      message: '',
      signature: '',
      ticketsOwned: 0,
      dialog: false
    }
  },

  async mounted() {
    await this.initProvider();
    await this.initContract();
  },

  methods: {

    async initProvider() {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum); //force it to version 1.2.8
        console.log("Current web3 version:",web3.version);
        let accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
        console.log("Current connected account:",this.account);
      } else {
        console.log("Please install Metamask to continue.");
      }
    },

    async initContract() {
      const contractAddress = "0xae6d6C4dDFdD3f8e67c95609199eB567b3c56AA0"; //updated smart contract Mumbai testnet
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
    },

    async verifySignature(message, signature) {
      const signer = await web3.eth.personal.ecRecover(message, signature);
      console.log("The signer address: " + signer);
      this.ticketsOwned = await this.contract.methods.balanceOf(signer).call();
      this.dialog = true;
    }
  }
}

</script>
