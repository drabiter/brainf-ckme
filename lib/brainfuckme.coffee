class Brainfuckme

  constructor: ->
    @reset()

  _trimCode: (source) ->
    source.replace(/[^+-.,<>\[\]]+/g, '')

  _operate: (commands, input) ->
    while @cursor < commands.length
      switch commands[@cursor]
        when '+' then @_increaseValue()
        when '-' then @_decreaseValue()
        when '>' then @_increasePointer()
        when '<' then @_decreasePointer()
        when ',' then @_assignInput(input)
        when '.' then @_assignOutput()
        when '[' then @_openLoop(commands)
        when ']' then @_closeLoop(commands)

  _increaseValue: ->
    @memory[@pointer] = 0 unless (@value() or @value()?)
    @memory[@pointer]++;

    @cursor++

  _decreaseValue: ->
    @memory[@pointer] = 0 unless (@value() or @value()?)
    @memory[@pointer]-- unless @value() <= 0

    @cursor++

  _increasePointer: ->
    @pointer++
    @memory[@pointer] = 0 unless @value()

    @cursor++

  _decreasePointer: ->
    @pointer-- unless @pointer <= 0

    @cursor++

  _assignInput: (input) ->
    value = input.shift()
    @memory[@pointer] = if value then value else 0

    @cursor++

  _assignOutput: ->
    @output.push(@value())

    @cursor++

  _openLoop: (commands) ->
    if @value() == 0
      @cursor = @_findMatch(commands, @cursor, commands.length - 1, '[', ']') + 1
    else
      @cursor++

  _closeLoop: (commands) ->
    @cursor = @_findMatch(commands, @cursor, 0, ']', '[')

  _findMatch: (commands, from, to, pair, target) ->
    count = 0
    for i in [from..to]
      if commands[i] is pair
        count++
      else if commands[i] is target
        count--
        return i if count is 0
    return NaN

  value: ->
    @memory[@pointer]

  run: (_src, _input, _callback) ->
    @input = _input.slice() if _input
    commands = @_trimCode(_src)
    @_operate(commands, @input)

    _callback(@output, @outputToString()) if _callback
    @output

  resume: (_src, _input, _callback) ->
    @cursor = 0
    @run(_src, _input)

    _callback(@output, @outputToString()) if _callback

  outputToString: ->
    chars = []
    for n in @output
      chars.push(String.fromCharCode(n))
    chars.join("")

  inputToArray: (string) ->
    array = []
    chars = string.split('')
    array.push(i.charCodeAt(0)) for i in chars
    array

  reset: ->
    @memory = new Array()
    @memory[0] = 0
    @pointer = 0
    @input = new Array()
    @output = new Array()
    @cursor = 0


module.exports = Brainfuckme

