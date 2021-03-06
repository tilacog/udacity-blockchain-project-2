/* ===== Persist data with LevelDB ===================================
   |  Learn more: level: https://github.com/Level/level     |
   |  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
    return db.put(key, value)
}

// Get data from levelDB with key
function getLevelDBData(key){
    return db.get(key);
}

// Returns how many entries exists on database
function countEntries() {
  return new Promise((resolve, reject) => {
     var count = 0;
     db.createKeyStream()
	  .on('data', (data) => { count++ })
	  .on('close', () => {resolve(count)});
  })
}


// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
        i++;
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function() {
        console.log('Block #' + i);
        addLevelDBData(i, value);
    });
}


async function clean_db() {
    db.createKeyStream()
	.on('data', function (key) {
	    db.del(key, function (err) {
		if (err)
		    console.log("error deleting key")
	    });
	})
}



/* ===== Testing ==============================================================|
   |  - Self-invoking function to add blocks to chain                             |
   |  - Learn more:                                                               |
   |   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
   |                                                                              |
   |  * 100 Milliseconds loop = 36,000 blocks per hour                            |
   |     (13.89 hours for 500,000 blocks)                                         |
   |    Bitcoin blockchain adds 8640 blocks per day                               |
   |     ( new block every 10 minutes )                                           |
   |  ===========================================================================*/
// (function theLoop (i) {
//     setTimeout(function () {
//         addDataToLevelDB('Testing data');
//         if (--i) theLoop(i);
//     }, 100);
// })(10);


module.exports = {
    db: db,
    addLevelDBData: addLevelDBData,
    getLevelDBData: getLevelDBData,
    countEntries: countEntries,
    clean_db: clean_db,
}
