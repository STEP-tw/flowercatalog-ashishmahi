const updateComments= require("./commentHandler.js").updateComments;

const dealWithQuery = function(query){
  let newComment = query;
  newComment["date"] = new Date().toLocaleString();
  updateComments(newComment);
}
exports.dealWithQuery = dealWithQuery;
