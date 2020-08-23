const SHA256 = require('crypto-js/sha256')

// Block Structure
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    // In calculating the hash SHA256 is used
    calculateHash() {
        //for the hash index, timestamp, data, previous hash is used
        return SHA256(this.index +
            this.timestamp +
            this.previousHash +
            JSON.stringify(this.data)).toString()
    }
}

// Simple Blockchain Structure
class Blockchain {
    constructor() {
        //rather than staring empty blockchain a genesis block is created
        this.chain = [this.createGenesisBlock()];
    }

    // method for initiating genesis block using block inheritance feature
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0")
    }

    // method to get the latest block created
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    // method to add new block to the chain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock)
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

// manually adding new blocks
coin.addBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), { amount: "$4" }))
coin.addBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), { amount: "$8" }))

// tampering the block and check if it detetcs the error or not
console.log(coin.isChainValid())
coin.chain[1].data = { amount: "$10" };
coin.chain[1].hash = coin.chain[1].calculateHash();
console.log(coin.isChainValid())

console.log(JSON.stringify(coin, null, 4))