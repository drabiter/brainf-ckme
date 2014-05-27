(function(){
  'use strict';

  var bfckme = new Brainfuckme();

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
  var timerEL = $$('#timer', mainEl);

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
    bfckme.reset();
    outputEl.value = '';

    var startTime = new Date();
    bfckme.run(
      consoleEl.value,                     // source code
      bfckme.inputToArray(inputEl.value),  // input array
      function(output, outputStr){         // callback
        console.log(output);
        outputEl.value = outputStr
        button.disabled = false;
        var endTime = new Date();
        var timeResult = endTime.getTime() - startTime.getTime();
        timerEL.innerHTML = timeResult;
      });
  };

  var resetBtn = $('#btnReset').onclick = function(e) {
    e.preventDefault();
    bfckme.reset();
    consoleEl.value = '';
    inputEl.value = '';
    outputEl.value = '';
  };

}());

