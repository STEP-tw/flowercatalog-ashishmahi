const Comments = function(){
  this.comments =[];
}

Comments.prototype.addComment = function (comment) {
  this.comments.unshift(comment);
};

Comments.prototype.map = function (mapperFn) {
  return this.comments.map(mapperFn);
};

module.exports = Comments;
