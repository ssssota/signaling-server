const express = require('express')
const webSocketServer = require('ws').Server

// HTTP server
const app = express()
const port = 8080

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`HTTP server is listening. (localhost:${port})`)
})

// WebSocket server
const wsPort = 3001
const wsServer = new webSocketServer({'port': wsPort})
console.log(`WebSocket server is listening. (localhost:${wsPort})`)

wsServer.on('connection', ws => {
    // console.log('ws onconnection')
    ws.on('message', message => {
        // console.log('onmessage')
        wsServer.clients.forEach(client => {
            if (ws !== client) {
                client.send(message)
            }
        })
    })
})