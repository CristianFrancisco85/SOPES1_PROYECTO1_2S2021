const mysql = require('mysql')
const express = require("express")
const router = express.Router()

const dbConector = mysql.createConnection({
  host: '34.122.159.115',
  user: 'root',
  password: 'password',
  database: 'mydb'
})


router.get("/fromCloudSQL",async (req, res) => {
  try {
    dbConector.query('SELECT * FROM Tweet',(err,result)=>{
      if(err) throw err
      res.send(result)
    })
  } catch (error) {
    throw error
  }
})

module.exports = router;