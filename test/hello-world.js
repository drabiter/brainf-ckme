var Brainfuckme = require('brainfuckme');
var code = '++++++++++[>+++++++>++++++++++>+++>+<<<<-]'
        + '>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.'
        + '+++.------.--------.>+.>.';

var brainfuckme = new Brainfuckme();

brainfuckme.run(code, 
  '', 
  {log: true},
  function(output){
    console.log(output.join(''));
  });