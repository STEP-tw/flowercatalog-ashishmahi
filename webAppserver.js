const webApp = require('./webApp.js');
const http = require('http');
const fs = require('fs');
const storeComment = require('./lib/storeComment.js').dealWithQuery;
let app = webApp.create();
let toS = o => JSON.stringify(o, null, 2);
const logRequest = (req, res) => {
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    // `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./data/requestLogs.txt', text, () => {});
  console.log(`${req.method} ${req.url}`);
};

const isFileRenderable = function(path){
  return fs.existsSync(path)
}

const isGetRequest = function(req){
  return req.method=="GET";
}

let fileServer = function(req, res) {
  let path = 'public' + req.url;
  if (isGetRequest(req)) {
    try {
      let data = fs.readFileSync(path);
      res.statusCode = 200;
      res.write(data);
      res.end()
    } catch (e) {
      return;
    };
  };
}

app.get("public/",(req,res)=>{
  res.redirect("index.html");
})

app.use(logRequest);
app.use(fileServer);

app.post("public/add-comment", (req, res) => {
  let postData = "";
  req.on("data", (chunk) => {
    postData += chunk
  })
  req.on("end", () => storeComment(postData.toString()));
  res.redirect("/guestPage.html");
})

const PORT = 5000;
let server = http.createServer(app);
server.on('error', e => console.error('**error**', e.message));
server.listen(PORT, (e) => console.log(`server listening at ${PORT}`));
