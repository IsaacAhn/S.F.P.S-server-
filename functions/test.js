module.exports = {
  receive : receive,
  reture : reture,
  reset : reset
};

var test;

function receive(msg){
	test = msg;
}

function reture(){
	return test;
}

function reset(){
  test = '';
}
