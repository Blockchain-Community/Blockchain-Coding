const SHA256 = require('crypto-js/sha256')

// transaction structure
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// Block Structure
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    // In calculating the hash SHA256 is used
    calculateHash() {
        //for the hash index, timestamp, data, previous hash is used
        return SHA256(
            this.timestamp +
            this.previousHash +
            this.nonce +
            JSON.stringify(this.data)).toString()
    }

    // mining method
    mineBlock(difficulty) {
        // here the hash is produced until first difficulty matches in the hash string
        while (this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash()
        }

        console.log("Block mined:", this.hash)
    }
}

// Simple Blockchain Structure
class Blockchain {
    constructor() {
        //rather than staring empty blockchain a genesis block is created
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransaction = []
        this.miningReward = 100
    }

    // method for initiating genesis block using block inheritance feature
    createGenesisBlock() {
        return new Block(Date.now(), "Genesis Block", "0")
    }

    // method to get the latest block created
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    // method to add new block to the chain
    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock)
    // }

    minePendingTransaction(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty)

        console.log("Block successfully mined!")
        this.chain.push(block)

         this.pendingTransaction = [new Transaction(null, miningRewardAddress, this.miningReward)]
    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain) for(const trans of block.transactions){
            if(trans.fromAddress === address) balance -= trans.amount;

            if(trans.toAddress === address) balance += trans.amount;
        }

        return balance;
    }

    // method to check if the chain is valid or not
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const previousBlock = this.chain[i - 1];
            const currentBlock = this.chain[i];

            // if the input are same then the hash generated is always same
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            // check if linked hash is correct or not
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

// intiating nee chain - OOP
let coin = new Blockchain();

// creating the transaction
coin.createTransaction(new Transaction('add1', 'add2', 100));
coin.createTransaction(new Transaction('add2', 'add1', 50))

console.log("\n Starting the miner");
coin.minePendingTransaction('sangya-add');
// this is repeated because reward is only added after the next block is added where the amount is transfered from system to address
coin.minePendingTransaction('sangya-add');

console.log(coin.getBalanceOfAddress('sangya-add'));


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