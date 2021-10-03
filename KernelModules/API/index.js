const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

var corsOptions = {origin:true, optionsSuccessStatus:200};
app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })

app.get('/kernelModules', function (req, res) {
    var content = '';
    fs.readFile('/proc/ram', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        content+="Totalram_ubuntu "+JSON.parse(data).total+"\nUsedram_ubuntu "+JSON.parse(data).en_uso+"\nFreeram_ubuntu "+JSON.parse(data).libre+"\n";
    });

    fs.readFile('/proc/cpu', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        content+="processes_ubuntu "+JSON.parse(data).procesos;
        res.send(content);   
    }); 
});


app.get('/ram', function (req, res) {   
	console.log("ram");
    fs.readFile('/proc/ram', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        res.send(data); 
    }); 
});

app.get('/cpu', function (req, res) {   
	console.log("cpu");
    fs.readFile('/proc/cpu', 'utf8' , (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        res.send(data); 
    }); 
});
