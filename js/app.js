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
      // consoleEl.focus();
    };
  }

  var backBtn = $('#btnBack');
  backBtn.onclick = function(e) {
    e.preventDefault();
    consoleEl.value = consoleEl.value.split('').slice(0, -1).join('');
    // consoleEl.focus();
  };

  var runBtn = $('#btnRun');
  runBtn.onclick = function(e) {
    e.preventDefault();
    this.disabled = true;
    Interpreter.reset();
    outputEl.value = '';
    Interpreter.run(
      consoleEl.value.split(''),  // source code
      inputEl.value.split(''),    // input data
      {log: true},                // options
      function(output){           // callback
        console.log(output);
        outputEl.value = output.join('');
        this.disabled = false;
      });
  };

  var resetBtn = $('#btnReset').onclick = function(e) {
    e.preventDefault();
    Interpreter.reset();
    consoleEl.value = '';
    // consoleEl.value = ' ++++++++++[>+++++++<-]>.';
  };

}());

// ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
// ++++++++++[>+++++++<-]>.
// +++[>++<-]>.