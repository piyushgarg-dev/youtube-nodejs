// Import Packages
const express = require("express");
const app = express();
const youtubedl = require("youtube-dl");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
var mime = require("mime");

// Middlewares
app.use(express.static("./public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

global.vtitle = "";

// Variables
const PORT = process.env.PORT || 5000;

// @Routes

// @Route: /
// @desc: Home Page
// Access: Public
app.get("/", (req, res) => {
  res.render("index");
  res.end();
});

// @Route: /download
// @desc: Download Page
// Access: Public
app.post("/download", (req, res) => {
  var url = req.body.linktext;
  var video = youtubedl(
    url,
    // Optional arguments passed to youtube-dl.
    ["--format=18"],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname }
  );

  // Will be called when the download starts.
  video
    .on("info", function(info) {
      // console.log('Download started');
      // console.log('filename: ' + info._filename);
      vtitle = info._filename;
      console.log("Global: ", vtitle);
      // console.log('size: ' + info.size);
    })
    .pipe(fs.createWriteStream('h.mp4'));
    
});

// Listner
app.listen(PORT, () => {
  console.log(`Server Started on PORT:${PORT}...`);
});
