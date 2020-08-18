const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash = () => {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:", this.hash)
    }
}

class Blockchain {
    constructor() {
        this.chain = [new Block(0, Date.now(), "Genesis Block", "0")];
        this.difficulty = 4;
    }

    getLatestBlock = () => {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock = (newBlock) =>{
        const latestBlock = this.getLatestBlock();
        newBlock.previousHash = latestBlock.hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid = () => {
        for(let i = 1; i < this.chain.length; i++){
            const previousBlock = this.chain[i - 1];
            const currentBlock = this.chain[i];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;

            if(currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

const coin = new Blockchain();

console.log("Mining block 1...")
coin.addNewBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), {amount: "$100"}));

console.log("Mining block 2...")
coin.addNewBlock(new Block(coin.getLatestBlock().index + 1, Date.now(), {amount: "$200"}));

// console.log(coin.isChainValid())

// tampering the chain
// coin.chain[1].data = "tampered data";
// coin.chain[1].hash = coin.chain[1].calculateHash();

console.log(coin.chain)
// console.log(coin.isChainValid())
