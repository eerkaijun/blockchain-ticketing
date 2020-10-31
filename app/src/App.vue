<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Username"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            type="Password"
            label="Password"
            prepend-icon="mdi-lock"
            append-icon="mdi-eye-off"
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        <h1>Create Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-btn v-on:click="createTicket('3')" color="blue">Mint</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        <h1>Put on Sales</h1>
      </v-card-title>
      <v-card-actions>
        <v-btn v-on:click="toggleSale('1')" color="green">Toggle</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        <h1>Purchase Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-btn v-on:click="buyTicket('1')" color="purple">Buy</v-btn>
      </v-card-actions>
    </v-card>
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
      web3Provider: null,
      contract: null,
      account: '0x0',
    }
  },

  async mounted() {
    await this.initProvider();
    await this.initContract();
  },

  methods: {
    async initProvider() {
      if (window.ethereum) {
        this.web3Provider = window.ethereum;
        web3 = new Web3(window.ethereum); //force it to version 1.2.8
        console.log("Current web3 version:",web3.version);
        let accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
        console.log("Current connected account:",this.account);
      } else {
        console.log("Please install Metamask to continue.");
      }

      setInterval(async() => {
        let updated;
        updated = await web3.eth.getAccounts();
        if (updated[0] !== this.account) {
          this.account = updated[0];
          // Call a function to update the UI with the new account
          alert("You changed account!");
        }
      }, 1000);
    },

    async initContract() {
      const contractAddress = "0x22Fc73bC6Af889A0Adb5405f126a600Ac3Cb4651"; //Mumbai testnet address
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
      console.log(this.account);
    },

    async createTicket(price) {
      await this.contract.methods.createTicket(price).send({from:this.account});
      console.log("Ticket created successfully!");
    },

    async toggleSale(id) {
      await this.contract.methods.toggleSale(id).send({from:this.account});
      console.log("Ticket put on sale!");
    },

    async buyTicket(id) {
      await this.contract.methods.buyTicket(id).send({from:this.account});
      console.log("Ticket bought successfully!");
    }

  }
}
</script>
