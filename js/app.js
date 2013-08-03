(function(){
  'use strict';

  var Interpreter = {
    Memory: {
      cells: [0], pointer: 0, length: 1
    },
    Code: {
      source: [], jump: [], pointer: 0
    },
    Input: {
      pointer: 0, length: 0
    },
    input: [],
    output: [],
    process: function(token) {
      switch (token) {
        case '+':
          ++this.Memory.cells[this.Memory.pointer];
          break;
        case '-':
          --this.Memory.cells[this.Memory.pointer];
          break;
        case '>':
          this.Memory.pointer++;
          if (this.Memory.pointer == this.Memory.length) {
            this.Memory.length++;
            this.Memory.cells.push(0);
          }
          break;
        case '<':
          if (this.Memory.pointer > 0) {
            this.Memory.pointer--;
          }
          break;
        case '.':
          this.output.push(String.fromCharCode(this.Memory.cells[this.Memory.pointer]));
          break;
        case ',': 
          if (this.Input.pointer < this.Input.length) {
            this.Memory.cells[this.Memory.pointer] = this.input.charCodeAt(this.Input.pointer);
            this.Input.pointer++;
          }
          break;
        case '[':
          if (this.Memory.cells[this.Memory.pointer] > 0) {
            this.Code.jump.push(this.Code.pointer);
          } else {
            var _sum = this.Code.source.length;
            var _stack = 0;
            for (var i = this.Code.pointer + 1; (i < _sum || this.Code.pointer == i); i++) {
              if (this.Code.source[i] == ']') {
                if (_stack === 0) {
                  this.Code.pointer = i;
                } else {
                  _stack--;
                }
              } else if (this.Code.source[i] == '[') {
                _stack++;
              }
            }
          }
          break;
        case ']':
          if (this.Memory.cells[this.Memory.pointer] <= 0) {
            this.Code.jump.pop();
          } else {
            this.Code.pointer = this.Code.jump[this.Code.jump.length - 1];
            console.log('Code.jump to '+this.Code.pointer);
          }
          break;
        default:
      }
      this.Code.pointer++;
    },
    run: function(codeArray, inputArray) {
      this.Code.source = codeArray;
      this.input = inputArray;
      var _sum = this.Code.source.length;
      for (this.Code.pointer = 0; this.Code.pointer < _sum;) {
        this.logToken(this.Code.pointer, this.Code.source[this.Code.pointer]);
        this.process(this.Code.source[this.Code.pointer]);
      }
      this.logToken(this.Code.pointer, this.Code.source[this.Code.pointer]);
      return this.output;
    },
    reset: function() {
      this.Memory.cells.length = 0;
      this.Memory.cells.push(0);
      this.Memory.pointer = 0;
      this.Memory.length = 1;

      this.Code.source.length = 0;
      this.Code.jump.length = 0;
      this.Code.pointer = 0;

      this.input.length = 0;
      this.output.length = 0;
      this.Input.pointer = 0;
      this.Input.length = 0;
    },
    logToken: function(c, token) {
      console.log('A[' + this.Memory.pointer + '] = ' + this.Memory.cells[this.Memory.pointer] + ' next: ' + token + ' line ' + c);
      console.log('  - ' + this.Memory.cells);
    }
  };

  // var interpreter = new Interpreter;

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
   
  var logToken = function(c, token) {
    console.log('A[' + pointer + '] = ' + A[pointer] + ' next: ' + token + ' line ' + c);
    console.log('  - ' + A);
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
    Interpreter.reset();
    outputEl.value = '';
    var _output = Interpreter.run(consoleEl.value.split(''), inputEl.value.split(''));
    console.log(_output);
    outputEl.value = _output.join('');
    this.disabled = false;
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