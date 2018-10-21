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


context('Configure LevelDB to persist dataset', function() {
    it('should persist and retrieve the entire blockchain using LevelDB', function() {
        // persist
        let blockchain = create_test_blockchain();
        blockchain.persistOnLevelDB();
        // retrieve
        db.get('blockchain', function (err, persisted_blockchain) {
            if (err) throw err;
            assert.equal(JSON.stringify(blockchain), persisted_blockchain);
        });
    })
})


context("Modify simpleChain.js functions to persist data with LevelDB", function() {
    specify("addBlock(newBlock) function includes a method to store newBlock with LevelDB.", function() {
        let blockchain = create_test_blockchain();
        for (let i=0; i < blockchain.chain.length; i++) {
            let block = blockchain.chain[i];
            db.get(block.hash, function(err, persisted_block) {
                if (err) throw err;
                assert.equal(JSON.stringify(block), persisted_block)
            })
        }
    })

    specify("Genesis block persist as the first block in the blockchain using LevelDB", function() {
        let blockchain = new Blockchain();
	let genesis_block = blockchain.chain[0];
        db.get(genesis_block.hash, function(err, persisted_block) {
            if (err) throw err;
            assert.equal(JSON.stringify(genesis_block), persisted_block)
        })
    })

})
