const Comments = require("./comments.js")
const fs = require('fs');
// let comments = new Comments();

const CommentHandler = function(filePath){
  this.filePath = filePath;
  this.comments = new Comments();
}

CommentHandler.prototype.load = function (comment) {
  let previousComments = fs.readFileSync(this.filePath,"utf8");
  this.comments.comments = JSON.parse(previousComments);
  this.comments.addComment(comment);
};

CommentHandler.prototype.saveFile = function(){
  let comments = this.comments.comments;
  let allComments = JSON.stringify(comments,null,2);
  fs.writeFileSync(this.filePath,allComments);
};

CommentHandler.prototype.map = function (mapperFn) {
  return this.comments.map(mapperFn)
};

const generatePara = function(date,name,comment){
  return `<p>${date}&nbsp;name:${name}:&nbsp;comment:${comment}</p>\n`
}

const toHtml = function(feedBack){
  return generatePara(feedBack.date,feedBack.name,feedBack.comment);
}

let handler = new CommentHandler("data/comments.json");

const updateComments = function(newComment){
  handler.load(newComment);
  handler.saveFile();
  let allComments = handler.map(toHtml).join("");
  fs.writeFileSync("./public/comments.html",allComments);
}
//get a feedBack , create a new comment,add it to comments,save the file
exports.updateComments= updateComments;
