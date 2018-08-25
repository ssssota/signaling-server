const express = require('express')
const webSocketServer = require('ws').Server

// HTTP server
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('public'))

const server = app.listen(port, () => {
    console.log(`HTTP server is listening. (localhost:${port})`)
})

// WebSocket server
const wsServer = new webSocketServer({ server })
console.log(`WebSocket server is listening.`)

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