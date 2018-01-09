const qs = require('querystring');
const updateComments= require("./commentHandler.js").updateComments;

const dealWithQuery = function(query){
  let newComment = qs.parse(query);
  newComment["date"] = new Date().toLocaleString();
  updateComments(newComment);
}
exports.dealWithQuery = dealWithQuery;
