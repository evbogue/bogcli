import { keys } from 'https://denobook.com/keys.js'
import { processReq } from 'https://denobook.com/pub.js'

function connect (server) {

  console.log(keys.pubkey())
  console.log('Connecting to ' + server)
  const ws = new WebSocket(server)
  ws.binaryType = 'arraybuffer'

  ws.onopen = () => {
    ws.send('connect:' + keys.pubkey())
  }

  ws.onmessage = (msg) => {
    processReq(msg.data, ws)
  }

  Deno.addSignalListener("SIGINT", () => {
    ws.send('disconnect:' + keys.pubkey())
    Deno.exit();
  })

  ws.onclose = (e) => {
    peers.delete(id)
    setTimeout(function () {
      connect(server)
    }, 1000)
  }

  let retryCount = 1

  ws.onerror = (err) => {
    setTimeout(function () {
      ws.close()
      retryCount++
    }, 10000 * retryCount)
  }
}

connect('wss://denobook.com/ws')
