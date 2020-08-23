const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const {Blockchain, Transaction} = require('./Blockchain')

const myKey = ec.keyFromPrivate('e3ea4007fb4406325b7391903a4fb1abd1f45dd45cb64e60bbff72cdba7d5df8');
const myWalletAddress = myKey.getPublic('hex');

// intiating nee chain - OOP
let coin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
coin.createTransaction(tx1);

// creating the transaction
// coin.createTransaction(new Transaction('add1', 'add2', 100));
// coin.createTransaction(new Transaction('add2', 'add1', 50))

console.log("\n Starting the miner");
coin.minePendingTransaction(myWalletAddress);

console.log(coin.getBalanceOfAddress(myWalletAddress));


// // manually adding new blocks
// // mining block
// console.log("Mining Block")
// coin.addBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), { amount: "$4" }))

// // mining block
// console.log("Mining Block")
// coin.addBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), { amount: "$8" }))

// tampering the block and check if it detetcs the error or not
// console.log(coin.isChainValid())
// coin.chain[1].data = { amount: "$10" };
// coin.chain[1].hash = coin.chain[1].calculateHash();
// console.log(coin.isChainValid())

// console.log(JSON.stringify(coin, null, 4))