var hyphy = require('..')
var hyperlog = require('hyperlog')
var memdb = require('memdb')

// a function that takes a kefir stream, and returns a kefir stream
function process (messageS) {

  // return a stream
  return messageS
    // filter for new chat messages
    .filter(m => m.value.type === 'new-chat')
    // take just the chat object from them
    .map(m => m.value.chat)
    // create an object chats, key'd by chat.id 
    .scan((state, chat) => {
      state[chat.id] = chat
      return state
    }, {})

}

var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var hy = hyphy(log)

process(hy).onValue(state => {
  console.log('new app state!', JSON.stringify(state))
})

log.append({
  type: 'new-chat',
  chat: {
    id: 1,
    name: 'my cool chat',
    description: 'join me in my cool chat'
  }
})

// > 'new app state!' {}
// > 'new app state!' {1: {id: 1, name: 'my cool chat', description: 'join me in my cool chat'}}
