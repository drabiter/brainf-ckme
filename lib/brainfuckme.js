var Brainfuckme = function(){
  this.Memory = {
    cells: [0], pointer: 0, length: 1
  };
  this.Code = {
    source: [], jump: [], pointer: 0
  };
  this.Input = {
    pointer: 0, length: 0
  };
  this.input = [];
  this.output = [];
  this.process = function(token) {
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
        console.log('print '+this.Memory.cells[this.Memory.pointer]);
        this.output.push(String.fromCharCode(this.Memory.cells[this.Memory.pointer]));
        break;
      case ',': 
        if (this.Input.pointer < this.input.length) {
          this.Memory.cells[this.Memory.pointer] = this.input[this.Input.pointer].charCodeAt(0);
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
  };
  this.reset = function() {
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
  };
  this.logToken = function(c, token) {
    console.log('A[' + this.Memory.pointer + '] = ' + this.Memory.cells[this.Memory.pointer] + ' next: ' + token + ' line ' + c);
    console.log('  - ' + this.Memory.cells);
  };
  this.run = function(code, inputArray, options, callback) {
    this.Code.source = code.replace(/[^+-.,<>\[\]]+/g, '');
    this.input = inputArray;
    var _sum = this.Code.source.length;
    for (this.Code.pointer = 0; this.Code.pointer < _sum;) {
      if (options.log) {
        this.logToken(this.Code.pointer, this.Code.source[this.Code.pointer]);
      }
      this.process(this.Code.source[this.Code.pointer]);
    }
    if (options.log) {
      this.logToken(this.Code.pointer, this.Code.source[this.Code.pointer]);
    }
    callback(this.output);
  };
}

module.exports = Brainfuckme;