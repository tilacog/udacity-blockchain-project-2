const assert = require('assert');
const {Block, Blockchain} = require('../simpleChain');
const {db} = require('../levelSandbox');


function create_test_blockchain() {
    let blockchain = new Blockchain();
    for (var i = 0; i <= 10; i++) {
        blockchain.addBlock(new Block("test data "+i));
    }
    return blockchain
}


describe('[Smoke Test] #indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
    });
});


describe('README.md test', function() {
    it('should validate when valid', function() {
	let blockchain = create_test_blockchain();
        assert(blockchain.validateChain());
    })
    it('should not validate when invalid', function() {
        let blockchain = create_test_blockchain();
        // Induce errors by changing block data
        let inducedErrorBlocks = [2,4,7];
        for (var i = 0; i < inducedErrorBlocks.length; i++) {
            blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
        }
        assert(!blockchain.validateChain());
    })
})


describe('Configure LevelDB to persist dataset', function() {
    it('should persist and retrieve blocks using LevelDB', function() {
	// persist
	let blockchain = create_test_blockchain();
	blockchain.persistOnLevelDB();
	// retrieve
	for (let i = 0; i < blockchain.chain.length; i++) {
	    let block = blockchain.chain[i];
	    db.get(block.hash, function (err, persisted_block) {
		if (err) throw err;
		assert.equal(JSON.stringify(block), persisted_block);
	    });
	}
    })
})
