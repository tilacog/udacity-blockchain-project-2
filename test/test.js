const assert = require('assert');
const {Block, Blockchain} = require('../simpleChain');
const {db, addLevelDBData, getLevelDBData, countEntries} = require('../levelSandbox');


async function create_test_blockchain() {
    let blockchain = new Blockchain();
    await blockchain.init()
    for (var i = 0; i <= 10; i++) {
        await blockchain.addBlock(new Block("test data "+i));
    }
    return blockchain
}


describe('[Smoke Test] #indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
    });
});


describe('README.md test', async function() {
    it('should validate when valid', async function() {
	let blockchain = await create_test_blockchain();
        assert(await blockchain.validateChain());
    })
    it('should not validate when invalid', async function() {
        let blockchain = await create_test_blockchain();
        // Induce errors by changing block data
        let inducedErrorBlocks = [2,4,7];
        for (var i = 0; i < inducedErrorBlocks.length; i++) {
	    block_index = inducedErrorBlocks[i]
	    const block = await blockchain.getBlock(block_index);
	    block.data = 'induced chain error';
	    await addLevelDBData(block.height, JSON.stringify(block));
        }
	const is_valid = await blockchain.validateChain();
        assert(!is_valid);
    })
})


context('Configure LevelDB to persist dataset', function() {
    it('should persist and retrieve the entire blockchain using LevelDB', async function() {
        // persist
        let blockchain = await create_test_blockchain();
        blockchain.persistOnLevelDB();
        // retrieve
        db.get('blockchain', function (err, persisted_blockchain) {
            if (err) throw err;
            assert.equal(JSON.stringify(blockchain), persisted_blockchain);
        });
    })
})


context("Modify simpleChain.js functions to persist data with LevelDB", function() {
    specify("addBlock(newBlock) function includes a method to store newBlock with LevelDB.", async function() {
        let blockchain = await create_test_blockchain();
        for (let i=0; i < blockchain.chain.length; i++) {
            let block = blockchain.chain[i];
            db.get(block.height, function(err, persisted_block) {
                if (err) throw err;
                assert.equal(JSON.stringify(block), persisted_block)
            })
        }
    })

    specify("Genesis block persist as the first block in the blockchain using LevelDB", async function() {
        let blockchain = new Blockchain();
	await blockchain.init();
	let genesis_block = blockchain.chain[0];
        db.get(genesis_block.height, function(err, persisted_block) {
            if (err) throw err;
            assert.equal(JSON.stringify(genesis_block), persisted_block)
        })
    })

})


/*
URL: https://review.udacity.com/#!/reviews/1521780

TITLE:Unable to review

REVIEWER NOTES:

Your project could not be reviewed. Please resubmit
after you address the issue noted below by the reviewer.

I am not able to add and get blocks ... I get the foll error:
I tried adding 2 blocks and retrieving second block
*/
context("Add two blocks and retrieve the second one", function() {
    specify("Reviewer issue", async function() {
	let blockchain = new Blockchain();
	console.log("created a new (empty) blockchain:")
	console.log(blockchain);
	assert.equal(await blockchain.getBlockHeight(), 0);

	console.log("Adding the first block to the blockchain");
	await blockchain.addBlock(new Block("first block"));
	assert.equal(await blockchain.getBlockHeight(), 1);
	let first_block = JSON.parse(await getLevelDBData(0));
	console.log("First block hash: " + first_block.hash);

	console.log("Adding a second block to the blockchain");
	await blockchain.addBlock(new Block("second block"));
	assert.equal(await blockchain.getBlockHeight(), 2);
	// console.log(blockchain);

	console.log("Retrieving second block by its height");
	let second_block = JSON.parse(await getLevelDBData(1));
	console.log(second_block);

    })
})
