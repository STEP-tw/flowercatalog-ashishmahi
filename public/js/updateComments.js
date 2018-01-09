const updateComments = function(){
  let name = document.getElementsByName('name')[0].value;
  let comment = document.getElementsByName('comment')[0].value;
  let postData = `name=${name}&comment=${comment}`
  let oReq = new XMLHttpRequest();
  let reqListener = function(){
    let comments = this.responseText;
    let commentsDiv = document.getElementById("comments");
    commentsDiv.innerText = comments;
  }
  oReq.addEventListener("load",reqListener)
  oReq.open("POST","add-comment");
  oReq.send(postData);
}
