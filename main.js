const SHA25 = require('crypto-js/sha256');
const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash).toString();
    }
}

class Blockchain {
    constructor() {
        this.blockchain = [new Block(0, Date.now(), "Genesis Block", "0")];
    }

    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addBlock(data) {
        const latestBlock = this.getLatestBlock();
        this.blockchain.push(new Block(latestBlock.index + 1, Date.now(), data, latestBlock.hash));
    }

    isValid() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const prevBlock = this.blockchain[i - 1];
            const currentBlock = this.blockchain[i];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            if (currentBlock.previousHash !== prevBlock.hash) return false;

            return true;
        }
    }
}

const newChain = new Blockchain();

newChain.addBlock({ amount: "$100" });
newChain.addBlock({ amount: "$1000" });

console.log(newChain.blockchain)