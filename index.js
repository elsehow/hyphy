var Kefir = require('kefir')

// `processF` is a fn that takes a kefir stream and returns a kefir stream
module.exports = (log, processF, newStateCb) => {

  // hyperlog data cb is (err, cb)
  // so we can use that kefir fromStream on the log
  const messageS = Kefir.fromCallback(cb => {
    log.createReadStream({live: true}).on('data', cb)
  })

  processF(messageS).onValue(newStateCb)

}
