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
        <h1>Purchase Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-btn color="purple">Buy</v-btn>
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
      if (typeof web3 !== 'undefined') {
        this.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider); //force it to version 1.2.7
        console.log(web3.version);
        this.account = web3.eth.accounts[0];
      } else {
        console.log("Please install Metamask to continue.");
      }

      setInterval(function() {
        // Check if account has changed
        if (web3.eth.accounts[0] !== this.account) {
          this.account = web3.eth.accounts[0];
          // Call a function to update the UI with the new account
          alert("You changed account!");
        }
      }, 100);
    },

    async initContract() {
      const contractAddress = "0x22Fc73bC6Af889A0Adb5405f126a600Ac3Cb4651"; //Mumbai testnet address
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
      console.log(this.account);
    },

    async createTicket(price) {
      console.log(this.contract);
      await this.contract.methods.createTicket(price).send({from:'0xEDB4400a8b1DEccc6C62DFDDBD6F73E48537012A'});
      console.log("Ticket created successfully!");
    }

  }
}
</script>
