const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const httpServer = http.createServer(app)

app
.use(express.urlencoded({ extended: false }))
.use(express.static(path.join(__dirname, '/client')))

.get('/', (req, res) => 
{
    res.send(path.join(__dirname, '/client/index.html'));
})

.post('/saveData', (req, res) => 
{
    console.log(req.body.data);

    if(req.body)
    {   
        console.log(`saving data ...`);

        try
        {
            fs.writeFileSync(path.join(__dirname, '/client/data.json'), data);

            console.log('succesfully saved data', data);
            res.status(200).send('ok');
        } 
        catch (err) 
        { 
            console.error(err);
            res.status(500).send('ko');
        }
    }
    else
    {
        console.log("invalid saveData body");
        res.status(500).send('ko');
    }
})

httpServer.listen(8080);