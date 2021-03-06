// Generated by CoffeeScript 1.7.1
(function() {
  var ALLOWED_CHARS, Brainfuckme, context, expect, sinon;

  expect = require("chai").expect;

  sinon = require("sinon");

  context = describe;

  Brainfuckme = require("../lib/brainfuckme");

  ALLOWED_CHARS = ['<', '>', ',', '.', '-', '+', '[', ']'];

  describe("Brainfuckme", function() {
    beforeEach(function() {
      return this.bfckme = new Brainfuckme();
    });
    describe("source", function() {
      it("trims the source to brainfuck only character", function() {
        var rawSrc, src;
        rawSrc = "+a-<A()>,.[9]";
        src = this.bfckme._trimCode(rawSrc);
        expect(src.indexOf('9')).to.eq(-1);
        expect(src.indexOf('A')).to.eq(-1);
        expect(src.indexOf('a')).to.eq(-1);
        return expect(src.length).to.eq(ALLOWED_CHARS.length);
      });
      it("convert string input to bytecode", function() {
        this.bfckme.run("", this.bfckme.inputToArray("ABC"));
        return expect(this.bfckme.input).to.eql([65, 66, 67]);
      });
      return it("creates deep copy of the input", function() {
        var input;
        input = [1, 2, 3];
        this.bfckme.run(",,,,,", input);
        return expect(input).to.eql([1, 2, 3]);
      });
    });
    describe("reset", function() {
      return it("sets all to initial value", function() {
        this.bfckme.run("++>+[>>++<-]");
        this.bfckme.reset();
        expect(this.bfckme.memory.length).to.eq(1);
        expect(this.bfckme.output.length).to.eq(0);
        expect(this.bfckme.pointer).to.eq(0);
        return expect(this.bfckme.cursor).to.eq(0);
      });
    });
    describe("parse the source", function() {
      return it("trims the code first", function() {
        var spy, src;
        src = "+something.-.";
        spy = sinon.spy(this.bfckme, "_trimCode");
        this.bfckme.run(src);
        return expect(spy.calledWith(src)).to.be["true"];
      });
    });
    describe("user interface", function() {
      return describe("get current pointed value", function() {
        return it("returns current value", function() {
          this.bfckme.memory = [1, 2, 3];
          expect(this.bfckme.value()).to.eq(1);
          this.bfckme.pointer = 1;
          expect(this.bfckme.value()).to.eq(2);
          this.bfckme.pointer = 2;
          return expect(this.bfckme.value()).to.eq(3);
        });
      });
    });
    describe("resuming operation", function() {
      return it("reset only cursor", function() {
        this.bfckme.run("++>>+<+++");
        expect(this.bfckme.pointer).to.eq(1);
        expect(this.bfckme.value()).to.eq(3);
        expect(this.bfckme.memory).to.eql([2, 3, 1]);
        this.bfckme.resume("+");
        expect(this.bfckme.pointer).to.eq(1);
        expect(this.bfckme.value()).to.eq(4);
        return expect(this.bfckme.memory).to.eql([2, 4, 1]);
      });
    });
    describe("callback", function() {
      it("calls callback with output stack on run", function() {
        var spy;
        spy = sinon.spy();
        this.bfckme.run(",-.", [98], spy);
        return expect(spy.calledWith([97], "a")).to.be["true"];
      });
      return it("calls callback with output stack on resume", function() {
        var spy;
        this.bfckme.run('++');
        spy = sinon.spy();
        this.bfckme.resume(",-.", [98], spy);
        return expect(spy.calledWith([97], "a")).to.be["true"];
      });
    });
    describe("processing the source", function() {
      var sharedFalsyValueTest;
      sharedFalsyValueTest = function(command, expected) {
        return context("when current value is not available", function() {
          it("fills null with 0", function() {
            this.bfckme.memory[this.bfckme.pointer] = null;
            this.bfckme.run(command);
            return expect(this.bfckme.value()).to.eq(expected);
          });
          return it("fills undefined with 0", function() {
            this.bfckme.memory[this.bfckme.pointer] = void 0;
            this.bfckme.run(command);
            return expect(this.bfckme.value()).to.eq(expected);
          });
        });
      };
      describe("(+) operator", function() {
        sharedFalsyValueTest("+", 1);
        return it("increase current pointed value", function() {
          this.bfckme.run("+");
          expect(this.bfckme.value()).to.eq(1);
          this.bfckme.resume("++");
          return expect(this.bfckme.value()).to.eq(3);
        });
      });
      describe("(-) operator", function() {
        sharedFalsyValueTest("-", 0);
        context("when current value > 0", function() {
          return it("reduce the current pointed value", function() {
            this.bfckme.memory[0] = 6;
            this.bfckme.run("-");
            expect(this.bfckme.value()).to.eq(5);
            this.bfckme.resume("---");
            return expect(this.bfckme.value()).to.eq(2);
          });
        });
        return context("when current value = 0", function() {
          return it("still 0", function() {
            this.bfckme.run("-");
            return expect(this.bfckme.value()).to.eq(0);
          });
        });
      });
      describe("(>) operator", function() {
        return it("moves pointer to right", function() {
          this.bfckme.run(">");
          expect(this.bfckme.pointer).to.eq(1);
          this.bfckme.resume(">>");
          return expect(this.bfckme.pointer).to.eq(3);
        });
      });
      describe("(<) operator", function() {
        context("when pointer > 0", function() {
          return it("moves pointer to left", function() {
            this.bfckme.pointer = 1;
            this.bfckme.run("<");
            return expect(this.bfckme.pointer).to.eq(0);
          });
        });
        return context("when pointer = 0", function() {
          return it("still 0", function() {
            this.bfckme.run("<");
            return expect(this.bfckme.pointer).to.eq(0);
          });
        });
      });
      describe("(,) operator", function() {
        return it("shift inputs' bytecode to current value", function() {
          var input;
          input = this.bfckme.inputToArray("ABC");
          this.bfckme.run(",", input);
          expect(this.bfckme.value()).to.eq(65);
          this.bfckme.pointer++;
          this.bfckme.resume(",");
          return expect(this.bfckme.value()).to.eq(66);
        });
      });
      describe("(.) operator", function() {
        return it("pushes value to output stack", function() {
          this.bfckme.memory = [1, 2, 3];
          this.bfckme.run(".");
          expect(this.bfckme.output).to.eql([1]);
          this.bfckme.pointer = 2;
          this.bfckme.resume(".");
          return expect(this.bfckme.output).to.eql([1, 3]);
        });
      });
      describe("([) operator", function() {
        describe("value is not zero", function() {
          return it("moves pointer forward", function() {
            this.bfckme.run("[++]");
            return expect(this.bfckme.cursor).to.eq(4);
          });
        });
        return describe("value is zero", function() {
          return it("moves to next of its close bracket", function() {
            this.bfckme.run("[]");
            return expect(this.bfckme.cursor).to.eq(2);
          });
        });
      });
      return describe("(]) operator", function() {
        it("moves to its open bracket", function() {
          this.bfckme.run("+[--]");
          return expect(this.bfckme.cursor).to.eq(5);
        });
        return it("breaks on no match", function() {
          this.bfckme.run("+.--]");
          return expect(this.bfckme.cursor).to.not.be.defined;
        });
      });
    });
    describe("private methods", function() {
      beforeEach(function() {
        return this.commands = '[.[].[[]].]';
      });
      describe("finding [] match forward", function() {
        return it("finds the right match", function() {
          var result;
          result = this.bfckme._findMatch(this.commands, 0, this.commands.length - 1, '[', ']');
          expect(result).to.eq(10);
          result = this.bfckme._findMatch(this.commands, 6, this.commands.length - 1, '[', ']');
          return expect(result).to.eq(7);
        });
      });
      return describe("finding [] match backward", function() {
        return it("finds the right match", function() {
          var result;
          result = this.bfckme._findMatch(this.commands, 8, 0, ']', '[');
          expect(result).to.eq(5);
          result = this.bfckme._findMatch(this.commands, 3, 0, ']', '[');
          return expect(result).to.eq(2);
        });
      });
    });
    return describe("test cases", function() {
      it("moves value0 to value2", function() {
        var src;
        src = "+++-+++>>[-]<<[->>+<<]";
        this.bfckme.run(src);
        return expect(this.bfckme.memory).to.eql([0, 0, 5]);
      });
      it("prints 'Hello World!'", function() {
        var src;
        src = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
        this.bfckme.run(src);
        return expect(this.bfckme.outputToString()).to.eq("Hello World!\n");
      });
      it("solves issue #1", function() {
        var src;
        src = "+[->>++++++<<]+[>>>[>>]<[[->>+<<]>>-[<<]]>+<<[-<<]<]>+>>[-<<]<+++++++++[->++++++++>+<<]>-.----.>.";
        this.bfckme.run(src);
        return expect(this.bfckme.outputToString()).to.eq("OK\n");
      });
      return it("gives back the output", function() {
        var input, output, src, text;
        src = ",[.,]";
        text = "I love nyancat";
        input = this.bfckme.inputToArray(text);
        output = this.bfckme.run(src, input);
        expect(this.bfckme.outputToString()).to.eq(text);
        return expect(this.bfckme.output).to.eql(input);
      });
    });
  });

}).call(this);
