const logout = function(){
  let oReq = new XMLHttpRequest();
  oReq.open("GET","logout");
  oReq.send();
}
