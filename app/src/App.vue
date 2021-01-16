<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h3>Address: {{account}}</h3>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn v-on:click="registerDialog=true" color="success">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-on:click="loginDialog=true" color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="registerDialog">
      <v-card>
        <v-card-title>
          Please fill in your personal details to register
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
    <v-dialog v-model="loginDialog">
      <v-card>
        <v-card-title>
          Enter your credentials to login
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Username" prepend-icon="mdi-account-circle"/>
            <v-text-field type="Password" label="Password" prepend-icon="mdi-lock" append-icon="mdi-eye-off"/>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.action="props">
        <v-btn v-if="props.item.on_sale" class="mx-2" dark color="pink" v-on:click="buyTicket(props.item.ticket_id)">
          Buy Ticket
        </v-btn>
      </template>
    </v-data-table>
    <v-data-table :headers="headers" :items="myTickets">
      <template v-slot:item.action="props">
        <v-btn class="mx-2" dark color="pink" v-on:click="selectTicketPrice(props.item.ticket_id, props.item.ticket_value)">
          Change Price
        </v-btn>
        <v-btn class="mx-2" dark color="green" v-on:click="toggleSale(props.item.ticket_id)">
          Toggle Sale
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="changePriceDialog">
      <v-card>
        <v-card-title>Change Ticket Price</v-card-title>
        <v-card-text>The current ticket price is {{currentPrice}} ether.</v-card-text>
        <v-card-text>The maximum ticket price is {{maxPrice}} ether.</v-card-text>
        <v-card-actions>
          <v-text-field v-model="price" label="Define Price (in ETH)"></v-text-field>
          <v-btn v-on:click="changeTicketPrice(ticketID, price)" color="blue">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="account==='0xEDB4400a8b1DEccc6C62DFDDBD6F73E48537012A' ">
      <v-card-title>
        Create Tickets
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
    <v-card v-if="account!=='0xEDB4400a8b1DEccc6C62DFDDBD6F73E48537012A' ">
      <v-card-title>
        Purchase Tickets
      </v-card-title>
      <v-card-actions>
        <v-select v-model="ticketID" :items="ticketsOnSale" label="Select Ticket ID"></v-select>
        <v-btn v-on:click="buyTicket(ticketID)" color="purple">Buy</v-btn>
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
      currentPrice: '',
      maxPrice: '',
      myTickets: [],
      toggleID: '',
      ticketsOnSale: [],
      ticketID: '',
      ticketPriceID: '',
      registerDialog: false,
      loginDialog: false,
      changePriceDialog: false,
      headers: [{ text: 'Seat Number', value: 'seat_number' },
                { text: 'Ticket Price (in ETH)', value: 'ticket_value' },
                { text: 'Category', value: 'ticket_category' },
                { text: 'Ticket ID', value: 'ticket_id'},
                { text: 'On Sale', value: 'on_sale'},
                { text: 'Action', value: 'action'}],
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
          this.initMarketplace();
          // Call a function to update the UI with the new account
          alert("You changed account!");
        }
      }, 1000);
    },

    async initContract() {
      const contractAddress = "0xa029C3a51e202a0A2Ab793fF480B90eB91887a42"; //Mumbai testnet address
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
      console.log(this.account);
      var self = this;
      this.contract.events.saleToggled().on('data', function(event){
        console.log("EVENT INCOMING!!!");
        self.initMarketplace(); //scope error
      }).on('error', console.error);

    },

    async initMarketplace() {
      this.ticketsOnSale = [];
      this.myTickets = [];
      this.items = [];
      const num_tickets = await this.contract.methods.getOnSaleLength().call();
      var uri, data, item, myTicket, onSale, owner;
      for (let i=0; i<num_tickets; i++) {
        onSale = await this.contract.methods.onSale(i).call();
        owner = await this.contract.methods.owners(i).call();
        if (onSale && owner != this.account) this.ticketsOnSale.push(i);
        //if (owner == this.account) this.myTickets.push(i);
        uri = await this.contract.methods.tokenURI(i).call();
        try {
          data = await axios.get(uri);
          if (owner == this.account) {
            myTicket = data.data;
            myTicket.ticket_id = i;
            myTicket.on_sale = await this.contract.methods.onSale(i).call();
            console.log(myTicket);
            this.myTickets.push(myTicket);
          } else {
            item = data.data;
            item.ticket_id = i;
            item.on_sale = await this.contract.methods.onSale(i).call();
            console.log(item);
            this.items.push(item);
          }
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
    },

    async selectTicketPrice(id, currentPrice) {
      this.ticketID = id;
      this.currentPrice = currentPrice;
      //let originalPrice = await this.contracts.methods.originalTicketPrice(id).call();
      //this.maxPrice = web3.utils.toWei(originalPrice,'ether') * 1.1;
      this.maxPrice = 0.1
      this.changePriceDialog = true;
    },

    async changeTicketPrice(id, price) {
      let uri = await this.contract.methods.tokenURI(id).call();
      var item;
      try {
        let data = await axios.get(uri);
        item = data.data;
        item.ticket_value = price;
        console.log(item);
      } catch (error) {
        console.log(error);
      }
      let result = await ipfs.add(JSON.stringify(item));
      console.log("IPFS hash: ", result.path);
      await this.contract.methods.changeTicketPrice(id, web3.utils.toWei(price,'ether'), result.path).send({from:this.account});
      console.log("Ticket price changed successfully!");
    }

  }
}
</script>
