var assert = require('assert');

describe('[Smoke Test] #indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
    });
});