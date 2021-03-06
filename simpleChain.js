/* ===== SHA256 with Crypto-js ===============================
   |  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
   |  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const {db, addLevelDBData, getLevelDBData, clean_db, countEntries} = require('./levelSandbox');


/* ===== Block Class ==============================
   |  Class with a constructor for block                           |
   |  ===============================================*/

class Block{
    constructor(data){
        this.hash = "",
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
   |  Class with a constructor for new blockchain               |
   |  ================================================*/

class Blockchain{
    constructor(){
        this.chain = [];
    }

    async init() {
	await clean_db();
	await this.addBlock(new Block("First block in the chain - Genesis block"));
    }

    // Add new block
    async addBlock(newBlock){
        // Block height
	newBlock.height = await this.getBlockHeight();
	// UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        // previous block hash
        if(this.chain.length>0){
            newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        this.chain.push(newBlock);
	// persist this block on LevelDB
	await addLevelDBData(newBlock.height, JSON.stringify(newBlock));

    }

    // Get block height
    async getBlockHeight(){
	return await countEntries() -1
    }

    // get block
    async getBlock(blockHeight){
	let block = await getLevelDBData(blockHeight);
	return JSON.parse(block)
    }

    // validate block
    async validateBlock(blockHeight){
        // get block object
        let block = await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
            return true;
        } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    async validateChain(){
        let errorLog = [];
        for (var i = 0; i < this.chain.length-1; i++) {
            // validate block
	    const valid_block = await this.validateBlock(i)
            if (!valid_block) errorLog.push(i);
            // compare blocks hash link
            let blockHash = this.chain[i].hash;
            let previousHash = this.chain[i+1].previousBlockHash;
            if (blockHash!==previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
	    return false
        } else {
            console.log('No errors detected');
	    return true
        }
    }

    // Persist the whole blockchain into LevelDB
    persistOnLevelDB(){
        addLevelDBData('blockchain', JSON.stringify(this));
    }
}


module.exports = {
    Block: Block,
    Blockchain: Blockchain,
}
