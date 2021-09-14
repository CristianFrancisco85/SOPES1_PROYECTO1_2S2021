const express = require("express")
const http = require("http")
const cors = require('cors')
const {PubSub} = require('@google-cloud/pubsub');

const port = process.env.PORT || 4000

const app = express()
app.use(cors({
    origin:'*',
    methods:'POST,GET'
}))
const endpoints = require("./endPoints")
app.use('/',endpoints)

const server = http.createServer(app)

/*========================================================================================
==================================SOCKET.IO===============================================
==========================================================================================*/
let interval
let newUpdates = false
let emitData

const io = require("socket.io")(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
  console.log("Usuario Conectado")
  if (interval) {
    clearInterval(interval)
  }

  interval = setInterval(() => emitUpdates(socket),1000)

  socket.on("disconnect", () => {
    console.log("Usuario Desconectado")
    clearInterval(interval)
  })

})

const emitUpdates = (socket) => {
    if(newUpdates){
        socket.emit("FromAPI",emitData)
        newUpdates=false
        emitData=undefined
    }
    
}

/*========================================================================================
====================================PUB/SUB===============================================
==========================================================================================*/

async function pubSubInit() {
    const pubsub = new PubSub({projectId:'sapient-ground-324600'})
    const subscription = await pubsub.subscription('dbUpdates-sub')
    subscription.on('message', message => {
        console.log('Received message:', message.data.toString())
        newUpdates=true
        try {
            emitData= JSON.parse(message.data.toString()) 
        } 
        catch (error) {
            
        }
        console.log(emitData)
        message.ack()
    })
    subscription.on('error', error => {
        console.error('Received error:', error)
    })
}

/*========================================================================================
====================================INIT SERVER===========================================
==========================================================================================*/

server.listen(port, () => {
    pubSubInit()
    console.log(`Listen on port ${port}`)
})

