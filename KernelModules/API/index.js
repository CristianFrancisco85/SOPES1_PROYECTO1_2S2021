const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })

app.get('/ram', function (req, res) {

    fs.readFile('/proc/ram', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        res.send(data);
    });    
});


app.get('/cpu', function (req, res) {

    fs.readFile('/proc/cpu', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        res.send(data);
    });    
});