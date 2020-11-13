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
    <v-card>
      <v-card-title>
        <h1>Create Tickets</h1>
      </v-card-title>
      <v-card-actions>
        <v-select v-model="price" :items="prices" label="Select Price"></v-select>
        <v-btn v-on:click="createTicket(price)" color="blue">Mint</v-btn>
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
        <v-select v-model="ticket" :items="tickets" label="Select Ticket ID"></v-select>
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

const conf = {
	marketplace: '0xeAF3Df71cD27D6B3d301ED373158e117AB436685',
	paymaster:   '0x56b7acbf49F53fA8723A7C41b1765B8C640A5aa7',
	relayhub:    '0x29e41C2b329fF4921d8AC654CEc909a0B575df20',
  forwarder:   '0x25CEd1955423BA34332Ec1B60154967750a0297D',
	gasPrice:    20000000000   // 20 Gwei
}

export default {
  name: 'App',
  data () {
    return {
      web3Provider: null,
      contract: null,
      account: '0x0',
      prices: ['0.01','0.02','0.03'],
      price: '',
      ids: [],
      id: '',
      tickets: [],
      ticket: '',
      ticketPrice: '',
      dialog: false
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
      //const contractAddress = "0x22Fc73bC6Af889A0Adb5405f126a600Ac3Cb4651"; //Mumbai testnet address
      const contractAddress = "0x96823E9836921Bd42C6Ff4EC96a33F64564017eE"; //new Mumbai testnet address
      this.contract = await new web3.eth.Contract(MarketplaceABI, contractAddress);
      console.log(this.account);
    },

    async initMarketplace() {

      setInterval(async() => {
        //update marketplace every 3 seconds
        const temp = await this.contract.methods.getOnSaleLength().call();
        var i, onSale, owner;
        for (i=0; i<temp; i++) {
          onSale = await this.contract.methods.onSale(i).call();
          owner = await this.contract.methods.owners(i).call();
          if (onSale) this.tickets.push(i);
          if (owner == this.account) this.ids.push(i);
        }
      }, 3000);

    },

    async createTicket(price) {
      await this.contract.methods.createTicket(web3.utils.toWei(price,'ether')).send({from:this.account});
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
