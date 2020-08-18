const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(data, index, timestamp, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = 0;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index +
            this.previousHash +
            JSON.stringify(this.data) +
            this.timestamp +
            this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Mined Block:", this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [new Block("Genesis Block", 1, Date.now(), "0")];
        this.difficulty = 4;
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        const latestBlock = this.getLatestBlock();
        newBlock.previousHash = latestBlock.hash;
        newBlock.index = latestBlock.index + 1;
        newBlock.timestamp = Date.now();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1;i < this.chain.length; i++){
            const prevBlock = this.chain[i - 1];
            const currentBlock = this.chain[i];

            if(currentBlock.hash !== currentBlock.calculateHash()) return true;

            if(currentBlock.previousHash !== prevBlock.hash) return true;
        }

        return false;
    }
}
const newChain = new Blockchain();

newChain.addBlock(new Block({amount: "$100"}));
newChain.addBlock(new Block({amount: "$200"}));

// tampering the chain
newChain.chain[1].data = {amount: "$500"};
newChain.chain[1].hash = newChain.chain[1].calculateHash();

console.log(newChain.chain)
console.log("Is chain tampered? =>", newChain.isChainValid());
