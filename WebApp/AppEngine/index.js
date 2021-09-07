const express = require("express")
const http = require("http")
const cors = require('cors')
const endpoints = require("./endPoints")
const mysql = require('mysql')
const {PubSub} = require('@google-cloud/pubsub');
const { emit } = require("process")

const port = process.env.PORT || 4001
const app = express()
const server = http.createServer(app)

app.use(cors)
app.use(endpoints)




const dbConector = mysql.createConnection({
    host: '34.122.159.115',
    user: 'root',
    password: 'password',
    database: 'mydb'
})

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
        emitData=message.data.toString()
    })
    subscription.on('error', error => {
        console.error('Received error:', error)
    })
}

/*========================================================================================
====================================INIT SERVER===========================================
==========================================================================================*/

pubSubInit()

server.listen(port, () => {
    
    console.log(`Listening on port ${port}`)
})


