(function(){
  'use strict';

  var Interpreter = new Brainfuckme();

  var $ = function(selector) {
    return document.querySelector(selector);
  };

  var $$ = function(selector, node) {
    return node.querySelector(selector);
  };

  var $$$ = function(selector) {
    return document.querySelectorAll(selector);
  };

  var mainEl = $('#main');
  var logEl = $$('#log', mainEl);
  var arrayEl = $$('#array', mainEl);
  var inputEl = $$('#input', mainEl);
  var outputEl = $$('#output', mainEl);
  var consoleEl = $$('#console', mainEl);

  var inputsBtn = $$$('.btnInput');
  for (var i = 0, sum = inputsBtn.length; i < sum; i++) {
    inputsBtn[i].onclick = function(e) {
      e.preventDefault();
      consoleEl.value += this.text;
    };
  }

  var backBtn = $('#btnBack');
  backBtn.onclick = function(e) {
    e.preventDefault();
    consoleEl.value = consoleEl.value.split('').slice(0, -1).join('');
  };

  var runBtn = $('#btnRun');
  runBtn.onclick = function(e) {
    e.preventDefault();

    var button = this;
    
    button.disabled = true;
    Interpreter.reset();
    outputEl.value = '';
    
    console.time('run');
    Interpreter.run(
      consoleEl.value,          // source code
      inputEl.value.split(''),  // input data
      {log: true},              // options
      function(output){         // callback
        console.log(output);
        outputEl.value = output.join('');
        button.disabled = false;
        console.timeEnd('run');
      });
  };

  var resetBtn = $('#btnReset').onclick = function(e) {
    e.preventDefault();
    Interpreter.reset();
    consoleEl.value = '';
  };

}());

// consoleEl.value = ' ++++++++++[>+++++++<-]>.';
// ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
// ++++++++++[>+++++++<-]>.
// +++[>++<-]>.