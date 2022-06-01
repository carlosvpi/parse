const assert = require('assert')
const {
  concat,
  disjunction,
  closure,
  option,
  literal,
  terminal,
  error
} = require('../src/primitives.js')
const tokenize = require('../src/tokenize.js')

const errorNode = (message) => error(message, [0,0])
const errorRule = message => (input, index) => [[errorNode(message)], index]
const successRule = value => (_, index) => [[value], index + 1]
const errorsAfterNCallsRule = n => (() => {
  let calls = 0
  return (input, index) => {
    return calls++ < n ? successRule(`Call ${calls}`)(input, index) : errorRule(`Error ${calls}`)(input, index)
  }
})()
const input = [1,2,3,4,5,6]

describe('parse', () => {
  describe('concat', () => {
    it('concats only 1 rule, which is error, and returns error', () => {
      assert.deepEqual(concat(errorRule('panic'))(input, 0), [[errorNode('panic')], 0])
    })
    it('concats only 1 rule, which is success, and returns success node', () => {
      assert.deepEqual(concat(successRule('a'))(input, 0), [['a'], 1])
    })
    it('concats 2 rules, first of which is error, and returns error', () => {
      assert.deepEqual(concat(errorRule('panic'), successRule('a'))(input, 0), [[errorNode('panic')], 0])
    })
    it('concats 2 rules, second of which is error, and returns success node', () => {
      assert.deepEqual(concat(successRule('a'), errorRule('panic'))(input, 0), [['a', errorNode('panic')], 1])
    })
    it('concats 2 rules, none of which is error, and returns success node', () => {
      assert.deepEqual(concat(successRule('a'), successRule('b'))(input, 0), [['a', 'b'], 2])
    })
    it('concats 5 successful rules, and returns success node', () => {
      assert.deepEqual(concat(successRule('a'), successRule('b'), successRule('c'), successRule('d'), successRule('e'))(input, 0), [['a', 'b', 'c', 'd', 'e'], 5])
    })
  })

  describe('disjunction', () => {
    const litInput = input.map((value, i) => ({ value, location: [0,0] }))

    it('disjuncts only 1 rule, which is error, and returns error', () => {
      assert.deepEqual(disjunction('test', errorRule('panic'))(litInput, 0), [[errorNode('test')], 0])
    })
    it('disjuncts only 1 rule, which is success, and returns success node', () => {
      assert.deepEqual(disjunction('test', successRule('a'))(litInput, 0), [['a'], 1])
    })
    it('disjuncts 2 rules, both of which are error, and returns error', () => {
      assert.deepEqual(disjunction('test', errorRule('panic 1'), errorRule('panic 2'))(litInput, 0), [[errorNode('test')], 0])
    })
    it('disjuncts 2 rules, first of which is error, and returns successful second one', () => {
      assert.deepEqual(disjunction('test', errorRule('panic'), successRule('a'))(litInput, 0), [['a'], 1])
    })
    it('disjuncts 2 rules, second of which is error, and returns successful first one', () => {
      assert.deepEqual(disjunction('test', successRule('a'), errorRule('panic'))(litInput, 0), [['a'], 1])
    })
    it('disjuncts 2 rules, none of which is error, and returns successful first node', () => {
      assert.deepEqual(disjunction('test', successRule('a'), successRule('b'))(litInput, 0), [['a'], 1])
    })
    it('disjuncts 2 rules, but it is at the end of the input', () => {
      assert.deepEqual(disjunction('test', successRule('a'), successRule('b'))(litInput, litInput.length), [[{ error: true, expected: 'test', location: [0,0] }],6])
    })
  })

  describe('closure', () => {
    it('closures rule, which is errors immediately, and returns empty', () => {
      assert.deepEqual(closure(errorRule('panic'))(input, 0), [[], 0])
    })
    it('closures rule, which is errors in the 2nd call, and returns correct node', () => {
      assert.deepEqual(closure(errorsAfterNCallsRule(1))(input, 0), [['Call 1'], 1])
    })
    it('closures rule, which is errors in the 3nd call, and returns correct node', () => {
      assert.deepEqual(closure(errorsAfterNCallsRule(2))(input, 0), [['Call 1', 'Call 2'], 2])
    })
    it('closures rule, which is errors in the 4nd call, and returns correct node', () => {
      assert.deepEqual(closure(errorsAfterNCallsRule(3))(input, 0), [['Call 1', 'Call 2', 'Call 3'], 3])
    })
  })

  describe('option', () => {
    it('otps rule, which is errors, and returns empty', () => {
      assert.deepEqual(option(errorRule('panic'))(input, 0), [[], 0])
    })
    it('otps rule, which is succeeds, and returns correct node', () => {
      assert.deepEqual(option(successRule('Success'))(input, 0), [['Success'], 1])
    })
  })

  describe('literal', () => {
    const litInput = input.map((value, i) => ({ value, location: [0,0] }))

    it('finds literal, and returns success node', () => {
      assert.deepEqual(literal(1)(litInput, 0), [[{ content: 1, location: [0,0], type: 'literal' }], 1])
    })
    it('does not find literal, and returns error node', () => {
      assert.deepEqual(literal('no')(litInput, 0), [[errorNode("'no'")], 0])
    })
    it('is at the end of the input, and returns error node', () => {
      assert.deepEqual(literal(1)(litInput, 7), [[errorNode(1)], 7])
    })
  })

  describe('terminal', () => {
    const litInput = input.map((value, i) => ({ terminal: 'term', value, location: [0, 0] }))

    it('finds terminal, and returns success node', () => {
      assert.deepEqual(terminal('term')(litInput, 0), [[{ content: 1, terminal: 'term', location: [0,0], type: 'terminal' }], 1])
    })
    it('does not find terminal, and returns error node', () => {
      assert.deepEqual(terminal('no')(litInput, 0), [[errorNode('a no')], 0])
    })
    it('is at the end of the input, and returns error node', () => {
      assert.deepEqual(terminal('term')(litInput, 7), [[errorNode('a term')], 7])
    })
  })
})