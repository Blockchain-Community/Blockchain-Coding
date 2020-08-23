const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// transaction structure
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress) throw new Error('You cannot sign transactions for other wallets!')
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature= sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) throw new Error('No signature in this transaction.')

        const publicKey = ec.keyFromPublic(this.fromAddress)
        return publicKey.verify(this.calculateHash(), this.signature)
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

    hasValidTransaction(){
        for(const tx of this.transactions) if(!tx.isValid()) return false;
        return true;
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
        if(!transaction.fromAddress || !transaction.toAddress) throw new Error("Transaction must include from and to addresses!")
        if(!transaction.isValid()) throw new Error("Cannot add invalid transaction");
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

            // check if there is valid transactions or not
            if(!currentBlock.hasValidTransaction()) return false

            // if the input are same then the hash generated is always same
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            // check if linked hash is correct or not
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

module.exports = {Blockchain, Transaction}