(function(){
  'use strict';

  var A = [0];
  var pointer = 0;
  // because length call is expensive
  var length = 1;

  var code = [];
  var jump = [];
  var cursor = 0;

  var input = [];
  var output = [];

  var inputPtr = 0;
  var inputLength = 0;

  var resetBF = function() {
    A.length = 0;
    A.push(0);
    pointer = 0;
    length = 1;

    code.length = 0;
    jump.length = 0;
    cursor = 0;

    input.length = 0;
    output.length = 0;
    inputPtr = 0;
    inputLength = 0;
  };

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

  var interpreter = function(token) {
    switch (token) {
      case '+':
        ++A[pointer];
        break;
      case '-':
        --A[pointer];
        break;
      case '>':
        pointer++;
        if (pointer == length) {
          length++;
          A.push(0);
        }
        break;
      case '<':
        if (pointer > 0) {
          pointer--;
        }
        break;
      case '.':
        output.push(String.fromCharCode(A[pointer]));
        break;
      case ',': 
        if (inputPtr < input.length) {
          A[pointer] = input.charCodeAt(inputPtr);
          inputPtr++;
        }
        break;
      case '[':
        if (A[pointer] > 0) {
          jump.push(cursor);
        } else {
          var _sum = code.length;
          var _stack = 0;
          for (var i = cursor + 1; (i < _sum || cursor == i); i++) {
            if (code[i] == ']') {
              if (_stack === 0) {
                cursor = i;
              } else {
                _stack--;
              }
            } else if (code[i] == '[') {
              _stack++;
            }
          }
        }
        break;
      case ']':
        if (A[pointer] <= 0) {
          jump.pop();
        } else {
          cursor = jump[jump.length - 1];
          console.log('jump to '+cursor);
        }
        break;
      default:
    }
    cursor++;
  };
   
  var logToken = function(c, token) {
    console.log('A[' + pointer + '] = ' + A[pointer] + ' next: ' + token + ' line ' + c);
    console.log('  - ' + A);
  };

  var run = function() {
    code = consoleEl.value.split('');
    input = inputEl.value;
    var _sum = code.length;
    for (cursor = 0; cursor < _sum;) {
      logToken(cursor, code[cursor]);
      interpreter(code[cursor]);
    }
    logToken(cursor, code[cursor]);
    outputEl.value = output.join('');
  };

  var runBtn = $('#btnRun').onclick = function(e) {
    e.preventDefault();
    resetBF();
    run();
  };

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
    resetBF();
    outputEl.value = '';
    run();
    this.disabled = false;
  };

  var resetBtn = $('#btnReset').onclick = function(e) {
    e.preventDefault();
    resetBF();
    consoleEl.value = '';
    // consoleEl.value = ' ++++++++++[>+++++++<-]>.';
  };

}());

// ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
// ++++++++++[>+++++++<-]>.
// +++[>++<-]>.