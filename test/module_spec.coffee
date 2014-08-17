expect = require("chai").expect
sinon = require("sinon")

context = describe

Brainfuckme = require("../lib/brainfuckme")

ALLOWED_CHARS = ['<', '>', ',', '.', '-', '+', '[', ']']


describe "Brainfuckme", ->

  beforeEach ->
    @bfckme = new Brainfuckme()

  describe "source", ->
    it "trims the source to brainfuck only character", ->
      rawSrc = "+a-<A()>,.[9]"
      src = @bfckme._trimCode(rawSrc)

      expect(src.indexOf('9')).to.eq(-1)
      expect(src.indexOf('A')).to.eq(-1)
      expect(src.indexOf('a')).to.eq(-1)
      expect(src.length).to.eq(ALLOWED_CHARS.length)

    it "convert string input to bytecode", ->
      @bfckme.run("", @bfckme.inputToArray("ABC"))

      expect(@bfckme.input).to.eql([65, 66, 67])

    it "creates deep copy of the input", ->
      input = [1, 2, 3]
      @bfckme.run(",,,,,", input)

      expect(input).to.eql([1, 2, 3])

  describe "reset", ->
    it "sets all to initial value", ->
      @bfckme.run("++>+[>>++<-]")
      @bfckme.reset()

      expect(@bfckme.memory.length).to.eq(1)
      expect(@bfckme.output.length).to.eq(0)
      expect(@bfckme.pointer).to.eq(0)
      expect(@bfckme.cursor).to.eq(0)

  describe "parse the source", ->
    it "trims the code first", ->
      src = "+something.-."
      spy = sinon.spy(@bfckme, "_trimCode")
      @bfckme.run(src)

      expect(spy.calledWith(src)).to.be.true

  describe "user interface", ->
    describe "get current pointed value", ->
      it "returns current value", ->
        @bfckme.memory = [1, 2, 3]
        expect(@bfckme.value()).to.eq(1)

        @bfckme.pointer = 1
        expect(@bfckme.value()).to.eq(2)

        @bfckme.pointer = 2
        expect(@bfckme.value()).to.eq(3)

  describe "resuming operation", ->
    it "reset only cursor", ->
      @bfckme.run("++>>+<+++")
      @bfckme.resume("+")

      expect(@bfckme.pointer).to.eq(1)
      expect(@bfckme.value()).to.eq(4)
      expect(@bfckme.memory).to.eql([2, 4, 1])

  describe "callback", ->
    it "calls callback with output stack on run", ->
      spy = sinon.spy()
      @bfckme.run(",-.", [98], spy)

      expect(spy.calledWith([97], "a")).to.be.true

    it "calls callback with output stack on resume", ->
      @bfckme.run('++')

      spy = sinon.spy()
      @bfckme.resume(",-.", [98], spy)

      expect(spy.calledWith([97], "a")).to.be.true

  describe "processing the source", ->
    describe "(+) operator", ->
      it "increase current pointed value", ->
        @bfckme.run("+")
        expect(@bfckme.value()).to.eq(1)

        @bfckme.resume("++")
        expect(@bfckme.value()).to.eq(3)

    describe "(-) operator", ->
      context "when current value > 0", ->
        it "reduce the current pointed value", ->
          @bfckme.memory[0] = 6

          @bfckme.run("-")
          expect(@bfckme.value()).to.eq(5)

          @bfckme.resume("---")
          expect(@bfckme.value()).to.eq(2)

      context "when current value = 0", ->
        it "still 0", ->
          @bfckme.run("-")

          expect(@bfckme.value()).to.eq(0)

    describe "(>) operator", ->
      it "moves pointer to right", ->
        @bfckme.run(">")
        expect(@bfckme.pointer).to.eq(1)

        @bfckme.resume(">>")
        expect(@bfckme.pointer).to.eq(3)

    describe "(<) operator", ->
      context "when pointer > 0", ->
        it "moves pointer to left", ->
          @bfckme.pointer = 1
          @bfckme.run("<")

          expect(@bfckme.pointer).to.eq(0)

      context "when pointer = 0", ->
        it "still 0", ->
          @bfckme.run("<")

          expect(@bfckme.pointer).to.eq(0)

    describe "(,) operator", ->
      it "shift inputs' bytecode to current value", ->
        input = @bfckme.inputToArray("ABC")

        @bfckme.run(",", input)
        expect(@bfckme.value()).to.eq(65)

        @bfckme.pointer++
        @bfckme.resume(",")
        expect(@bfckme.value()).to.eq(66)

    describe "(.) operator", ->
      it "pushes value to output stack", ->
        @bfckme.memory = [1, 2, 3]
        @bfckme.run(".")
        expect(@bfckme.output).to.eql([1])

        @bfckme.pointer = 2
        @bfckme.resume(".")
        expect(@bfckme.output).to.eql([1, 3])

    describe "([) operator", ->
      describe "value is not zero", ->
        it "moves pointer forward", ->
          @bfckme.run("[++]")

          expect(@bfckme.cursor).to.eq(4)

      describe "value is zero", ->
        it "moves to next of its close bracket", ->
          @bfckme.run("[]")

          expect(@bfckme.cursor).to.eq(2)

    describe "(]) operator", ->
      it "moves to its open bracket", ->
        @bfckme.run("+[--]")

        expect(@bfckme.cursor).to.eq(5)

  describe "private methods", ->
    beforeEach ->
        @commands = '[.[].[[]].]'

    describe "finding [] match forward", ->
      it "finds the right match", ->
        result = @bfckme._findMatch(@commands, 0, @commands.length - 1, '[', ']')
        expect(result).to.eq(10)

        result = @bfckme._findMatch(@commands, 6, @commands.length - 1, '[', ']')
        expect(result).to.eq(7)

    describe "finding [] match backward", ->
      it "finds the right match", ->
        result = @bfckme._findMatch(@commands, 8, 0, ']', '[')
        expect(result).to.eq(5)

        result = @bfckme._findMatch(@commands, 3, 0, ']', '[')
        expect(result).to.eq(2)

  describe "test cases", ->
    it "moves value0 to value2", ->
      src = "+++-+++>>[-]<<[->>+<<]"
      @bfckme.run(src)

      expect(@bfckme.memory).to.eql([0, 0, 5])

    it "prints 'Hello World!'", ->
      src = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
      @bfckme.run(src)

      expect(@bfckme.outputToString()).to.eq("Hello World!\n")

    it "solves issue #1", ->
      src = "+[->>++++++<<]+[>>>[>>]<[[->>+<<]>>-[<<]]>+<<[-<<]<]>+>>[-<<]<+++++++++[->++++++++>+<<]>-.----.>."
      @bfckme.run(src)

      expect(@bfckme.outputToString()).to.eq("OK\n")

    it "gives back the output", ->
      src = ",[.,]"
      text = "I love nyancat"
      input = @bfckme.inputToArray(text)
      output = @bfckme.run(src, input)

      expect(@bfckme.outputToString()).to.eq(text)
      expect(@bfckme.output).to.eql(input)

