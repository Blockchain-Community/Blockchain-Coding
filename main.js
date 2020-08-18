const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash = () => {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [new Block(0, Date.now(), "Genesis Block", "0")];
    }

    getLatestBlock = () => {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock = (data) =>{
        const latestBlock = this.getLatestBlock();
        this.chain.push(new Block(latestBlock.index + 1, Date.now(), data, latestBlock.hash));
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

coin.addNewBlock({amount: "$100"});
coin.addNewBlock({amount: "$200"});

console.log(coin.isChainValid())

// tampering the chain
coin.chain[1].data = "tampered data";
coin.chain[1].hash = coin.chain[1].calculateHash();

console.log(coin.chain)
console.log(coin.isChainValid())
