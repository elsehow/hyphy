var Kefir = require('kefir')

module.exports = (log) => {
  // hyperlog data cb is (err, cb)
  // so we can use that kefir fromStream on the log
  return Kefir.stream(e => {
    log.createReadStream({live: true}).on('data', (err, node) => {
      if (err) 
        e.error(err)
      if (node) 
        e.emit(node)
    })
  })
}
