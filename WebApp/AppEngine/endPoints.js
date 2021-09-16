const mysql = require('mysql')
const express = require("express")
const router = express.Router()

const dbConector = mysql.createConnection({
  host: '34.123.196.134',
  user: 'root',
  password: 'l9j6oytdaq9DGhbO@',
  database: 'mydb'
})


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

module.exports = router;