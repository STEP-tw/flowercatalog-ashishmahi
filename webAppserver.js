const webApp = require('./webApp.js');
const http = require('http');
const fs = require('fs');
const storeComment = require('./lib/storeComment.js').dealWithQuery;
const parseBody = require("./webApp.js").parseBody;
let app = webApp.create();
let toS = o => JSON.stringify(o, null, 2);
const logRequest = (req, res) => {
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.loginDetails)}`, ''
  ].join('\n');
  fs.appendFile('./data/requestLogs.txt', text, () => {});
  console.log(`${req.method} ${req.url}`);
};

let registered_users = [{userName:'ashishm',name:'ashish mahindrakar'}];

const isFileRenderable = function(path){
  return fs.existsSync(path)
}

const isGetRequest = function(req){
  return req.method=="GET";
}

const requestNotFound = function(req,res){
  let url = req.url;
  res.write(`${url} Not Found`);
  res.end()
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
const isPost = function(req){
  return req.method == "POST";
}
//
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(["/add-comment",'/login']) && req.user) res.redirect('/guestPage.html');
}

let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/add-comment']) && !req.user){
    res.redirect('/login');
  }
}

app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write('<form method="post"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
});

app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.loginDetails.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let date = new Date();
  let sessionid = date.getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestPage.html');
});


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

app.get("/",(req,res)=>{
  res.redirect("index.html");
})

app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedOutUserToLogin);
app.use(redirectLoggedInUserToHome);
app.addPostProcessor(fileServer);
app.addPostProcessor(requestNotFound);
app.post("/add-comment", (req, res) => {
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
