const { Option, Result } = require(".");
//
const res = Option.Some("fds");

for(const {Some: data, end} = res; end();){
  console.log("got data:", data);
}
for(const {None, end} = res; end();){
  console.log("got nothing");
}

if(res.isSome()){
  console.log("got data:", res.unwrap());
}else{
  console.log("got nothing");
}

