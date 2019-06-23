// Import Packages
const express = require('express');
const app = express();
const youtubedl = require('youtube-dl');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
var mime = require('mime');

// Middlewares
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Variables
const PORT = process.env.PORT || 5000;


// @Routes

// @Route: / 
// @desc: Home Page
// Access: Public
app.get('/', (req,res)=>{
    res.render('index');
    res.end();
});


// @Route: /download 
// @desc: Download Page
// Access: Public
app.post('/download', (req,res)=>{
    
    var url = req.body.linktext;
    var video = youtubedl(url,['--format=18'],{cwd:__dirname});
    video.on('info',info=>{
       var title = info._filename;
       pipeVideo(title);
    });
    function pipeVideo(title){
        video.pipe(fs.createWriteStream(title));
        downLoadtoClient(title);
        
        res.redirect('/');
        res.end();
        
    }

    function downLoadtoClient(title){
        
        res.download(`./${title}`, title, function (err) {
            if (err) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
              console.log('Failed download: '+title);
              console.log('Headers: '+res.headersSent);
              //res.sendFile(`/${title}`);
            } else {
              // decrement a download credit, etc.
              console.log('Successfull download: '+title);
            }
          })
    }
    
    
    
});



// Listner
app.listen(PORT, ()=>{
    console.log(`Server Started on PORT:${PORT}...`);
});