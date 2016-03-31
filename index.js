var Kefir = require('kefir')

module.exports = (log) => {
  // hyperlog data cb is (err, cb)
  // so we can use that kefir fromStream on the log
  return Kefir.fromEvents(log.createReadStream({live: true}), 'data')
}
