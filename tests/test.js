const assert = require('assert');
const {Block, Blockchain} = require('../simpleChain');


describe('[Smoke Test] #indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
    });
});

describe('README.md test', function() {
    it('should validate when valid', function() {
        let blockchain = new Blockchain();
        for (var i = 0; i <= 10; i++) {
            blockchain.addBlock(new Block("test data "+i));
        }
        assert(blockchain.validateChain());
    })
    it('should not validate when invalid', function() {
        let blockchain = new Blockchain();
        for (var i = 0; i <= 10; i++) {
            blockchain.addBlock(new Block("test data "+i));
        }
	// Induce errors by changing block data
        let inducedErrorBlocks = [2,4,7];
        for (var i = 0; i < inducedErrorBlocks.length; i++) {
            blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
        }
	assert(!blockchain.validateChain());
    })
})
