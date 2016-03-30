# hyphy

use [Kefir streams](https://rpominov.github.io/kefir/)
to incrementally build an application state using messages that come over a [hyperlog](https://github.com/mafintosh/hyperlog][hyperlog)

since we cannot know the order in which we will receive hyperlog nodes, CES/FRP gives us an advantage. we can use `bufferBy`, `bufferWhileBy`, and other tricks, followed by a final `scan` to produce a stream of application states, all of which are built incrementally from hyperlog messages

we can use the resulting stream objects to power react/virtual-dom-like views, and/or to save stuff into an app db. with some trickery, we can even use such a stream to purposefully remember/replicate only certain parts of the hyperlog, although doing that is outside of this module's scope.

## installation

    npm install hyphy

## usage

```javascript
var hyphy = require('hyphy')
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

var hy = hyphy(log, process, state => {
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
```

## api

### hyphy(hyperlog, processF, newStateCb)

`processF` takes a Kefir stream and returns a Kefir stream. you don't have to produce this stream. See the [Kefir docs](https://rpominov.github.io/kefir/) for details on interacting with Kefir streams.

the stream that `processF` returns should be a stream of application states, whatever that means to you. 

`newStateCb(state)` is called whenever a new item comes over the stream returned by `processF`

## license
BSD
