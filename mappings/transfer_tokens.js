const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient;
const config = require('./config');

// for mumbai testnet
const maticPOSClient = new MaticPOSClient({
  network: "testnet",
  version: "mumbai",
  parentProvider: "https://goerli.infura.io/v3/3275f4ffdd0d4b3e8ac104b1bd78007d",
  maticProvider: "https://rpc.maticvigil.com/?jwt=eyJhbGciOiJIUzI1NiJ9.czE4MDA4ODNAZWQuYWMudWs.k1sAuWo0DKfqkQZs09A4gV6FU4pHnBr1Jr0iFjbRyeU"
});

const execute = async () => {
  try {
    const tx1 = await maticPOSClient.approveERC721ForDeposit(config.root.DERC721, config.user.tokenId);
    console.log("Approving predicate contract for depost!");
    console.log(tx1.transactionHash); // eslint-disable-line
    const tx2 = await maticPOSClient.depositERC721ForUser(config.root.DERC721, config.user.address, config.user.tokenId);
    console.log("Depositing to root chain contract!")
    console.log(tx2.transactionHash) // eslint-disable-line
  } catch (e) {
    console.error(e) // eslint-disable-line
  }
}

execute().then(() => process.exit(0));
