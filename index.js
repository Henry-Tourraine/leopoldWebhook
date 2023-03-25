let http = require('http');
let crypto = require('crypto');
let  { exec } = require('child_process');
const express = require('express');
const app = express();
// you explicitly create the http server
const server = require('http').createServer(app);


const SECRET = 'LEOPOLD';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");




app.post("/", (req, res) => {
    req.on("data", chunk=>{
        console.log(chunk)
    })
   
   
      const signature = `sha1=${crypto
        .createHmac('sha1', SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex')}`;

      const isAllowed = req.headers['x-hub-signature'] === signature;
      console.log("allowed : ", isAllowed)
      
        
      const body = req.body;
      //console.log(req.headers)

      const isMaster = body?.ref === 'refs/heads/main';

      if (isAllowed && isMaster) {
        console.log("allowed")
        const { exec } = require('child_process');

        exec('cd ../launch.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout:\n${stdout}`);
        });
      }
     
      res.end();

    });

app.get("/register", (req, res)=>{
    res.render("index");
})

app.post("/register", (req, res)=>{
    if(!!req.body.email==false)res.json({message: "no email"});
    createUserFiles(req.body.email);
    res.json({message: "done"});
})

 app.listen(2000, ()=>console.log("webhook listens on port 2000..."));