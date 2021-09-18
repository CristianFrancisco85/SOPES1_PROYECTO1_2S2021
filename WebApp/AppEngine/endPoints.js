const mysql = require('mysql')
const express = require("express")
const router = express.Router()
const { MongoClient } = require("mongodb");

const dbConector = mysql.createConnection({
  host: '34.123.196.134',
  user: 'root',
  password: 'l9j6oytdaq9DGhbO@',
  database: 'mydb'
})

const uri ='mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@'
const client = new MongoClient(uri);

router.get("/fromCloudSQL",async (req, res) => {
  try {
    dbConector.query('SELECT *,DATE_FORMAT(Fecha, "%d-%m-%Y") as Fecha FROM Tweet',(err,result)=>{
      if(err) throw err
      res.send(result)
    })
  } catch (error) {
    throw error
  }
})

router.get("/fromCosmosDB", async (req, res) => {
  try {
    await client.connect()
    const database = client.db("mydb")
    const tweetsCollection = database.collection('tweet')
    const cursor = tweetsCollection.find({})
    const tweets = await cursor.toArray()
    res.send(tweets)
  } 
  finally {
    await client.close();
  }
})



module.exports = router;