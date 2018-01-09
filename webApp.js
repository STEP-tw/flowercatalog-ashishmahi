const fs = require('fs');

const redirect = function(path){
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location',path);
  this.end();
};

const invoke = function(req,res){
let path = `public${req.url}`
  let handler = this._handlers[req.method][path];
  if(!handler){
    res.statusCode = 404;
    res.write('File not found!');
    res.end();
    return;
  }
  handler(req,res);
};

const initialize = function(){
  this._handlers = {GET:{},POST:{}};
  this._preprocess = [];
};

const get = function(url,handler){
  this._handlers.GET[url] = handler;
};

const post = function(url,handler){
  this._handlers.POST[url] = handler;
};

const use = function(handler){
  this._preprocess.push(handler);
};

const main = function(req,res){
  res.redirect = redirect.bind(res);
  let path = `public${req.url}`;
  this._preprocess.forEach(middleware=>{
    if(res.finished) return;
    middleware(req,res);
  });
  if(res.finished) return;
  invoke.call(this,req,res);
};

const create = ()=>{
  let rh = (req,res)=>{
    main.call(rh,req,res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  return rh;
};

exports.create = create;
