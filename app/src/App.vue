<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h3>Address: {{account}}</h3>
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
        <v-btn v-on:click="dialog=true" color="success">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <h3>Please fill in your personal details to register</h3>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Full Name"/>
            <v-text-field label="Date of Birth"/>
            <v-text-field label="Email Address"/>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="items"></v-data-table>
    <v-card>
      <v-card-title>
        <h1>Create Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-text-field v-model="seat" label="Define Seat Number"></v-text-field>
        <v-select v-model="category" :items="categories" label="Select Category"></v-select>
      </v-card-actions>
      <v-card-actions>
        <v-text-field v-model="price" label="Define Price (in ETH)"></v-text-field>
        <v-btn v-on:click="createTicket(price, seat, category)" color="blue">Mint</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        <h1>Put on Sales</h1>
      </v-card-title>
      <v-card-actions>
        <v-select v-model="id" :items="ids" label="Select Ticket ID"></v-select>
        <v-btn v-on:click="toggleSale(id)" color="green">Toggle</v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        <h1>Purchase Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-select v-model="ticket" :items="ticketsOnSale" label="Select Ticket ID"></v-select>
        <v-card-text>The price for ticket ID {{ticket}} is {{ticketPrice}}</v-card-text>
        <v-btn v-on:click="buyTicket(ticket)" color="purple">Buy</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script language="javascript" type="text/javascript" src="jslibs/web3.min.js"></script>
<script>

import MarketplaceABI from './plugins/Marketplace';

const Web3 = require('web3');
const axios = require('axios');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

export default {
  name: 'App',
  data () {
    return {
      web3Provider: null,
      contract: null,
      account: '0x0',
      categories: ['Normal', 'VIP'],
      category: '',
      seat: '',
      price: '',
      ids: [],
      id: '',
      ticketsOnSale: [],
      ticket: '',
      ticketPrice: '',
      dialog: false,
      headers: [{ text: 'Seat Number', value: 'seat_number' },
                { text: 'Ticket Price', value: 'ticket_value' },
                { text: 'Category', value: 'ticket_category' },
                { text: 'Ticket ID', value: 'ticket_id'},
                { text: 'On Sale', value: 'on_sale'}],
      items: []
    }
  },

  async mounted() {
    await this.initProvider();
    await this.initContract();
    await this.initMarketplace();
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
        //check whether account is changed at every one second interval
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
      const contractAddress = "0x4cac580E78Eb67B2F3d2c519419e248b5d7E30b9"; //Mumbai testnet address
      //const contractAddress = "0x96823E9836921Bd42C6Ff4EC96a33F64564017eE"; //old Mumbai testnet address
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
      console.log(this.account);
    },

    async initMarketplace() {
      /*
      setInterval(async() => {
        //update marketplace every 3 seconds
        const temp = await this.contract.methods.getOnSaleLength().call();
        var i, onSale, owner;
        for (i=0; i<temp; i++) {
          onSale = await this.contract.methods.onSale(i).call();
          owner = await this.contract.methods.owners(i).call();
          if (onSale) this.ticketsOnSale.push(i);
          if (owner == this.account) this.ids.push(i);
        }
      }, 3000);
      */

      const num_tickets = await this.contract.methods.getOnSaleLength().call();
      var uri, data, item;
      for (let i=0; i<num_tickets; i++) {
        uri = await this.contract.methods.tokenURI(i).call();
        try {
          data = await axios.get(uri);
          item = data.data;
          item.ticket_id = i;
          item.on_sale = await this.contract.methods.onSale(i).call();
          console.log(item);
          this.items.push(item);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async createTicket(price, seat, category) {
      let metadata = {"seat_number":seat, "ticket_category":category, "ticket_value":price};
      console.log(JSON.stringify(metadata));
      let result = await ipfs.add(JSON.stringify(metadata));
      console.log("IPFS hash: ", result.path);
      await this.contract.methods.createTicket(web3.utils.toWei(price,'ether'), result.path).send({from:this.account});
      console.log("Ticket created successfully!");
    },

    async toggleSale(id) {
      await this.contract.methods.toggleSale(id).send({from:this.account});
      console.log("Ticket put on sale!");
    },

    async buyTicket(id) {
      const to_be_paid = await this.contract.methods.ticketPrice(id).call()
      await this.contract.methods.buyTicket(id).send({from:this.account, value:to_be_paid});
      console.log("Ticket bought successfully!");
    }

  }
}
</script>
