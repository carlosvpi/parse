const assert = require('assert')
const {
  concat,
  disjunction,
  closure,
  option,
  literal,
  terminal,
  error,
  Grammar
} = require('../src/metagrammar.js')
const tokenize = require('../src/tokenize.js')

const input = [1,2,3,4,5,6]

describe('metagrammar', () => {
  describe('Grammar', () => {
    it('parses an empty string', () => {
      assert.deepEqual(Grammar([], 0), [[{content: [],type: 'GRAMMAR'}],0])
    })
    it('parses a correct 1 simple rule grammar', () => {
      assert.deepEqual(Grammar(tokenize(`S = '0'.`), 0), [[{"type":"GRAMMAR","content":[{"type":"RULE","content":[{"type":"terminal","terminal":"uppercase","content":"S","location":[1,0]},{"type":"literal","content":"=","location":[1,2]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"'0'","location":[1,4]}]}]}]},{"type":"literal","content":".","location":[1,7]}]}]}],4])
    })
    it('parses a correct complex grammar', () => {
      assert.deepEqual(Grammar(tokenize(`S = '0' (num | {"," A}).A=[{'.' S} ';'] '?'.`), 0), [[{"type":"GRAMMAR","content":[{"type":"RULE","content":[{"type":"terminal","terminal":"uppercase","content":"S","location":[1,0]},{"type":"literal","content":"=","location":[1,2]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"'0'","location":[1,4]}]},{"type":"BASE","content":[{"type":"literal","content":"(","location":[1,8]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"lowercase","content":"num","location":[1,9]}]}]},{"type":"literal","content":"|","location":[1,13]},{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"literal","content":"{","location":[1,15]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"\",\"","location":[1,16]}]},{"type":"BASE","content":[{"type":"terminal","terminal":"uppercase","content":"A","location":[1,20]}]}]}]},{"type":"literal","content":"}","location":[1,21]}]}]}]},{"type":"literal","content":")","location":[1,22]}]}]}]},{"type":"literal","content":".","location":[1,23]}]},{"type":"RULE","content":[{"type":"terminal","terminal":"uppercase","content":"A","location":[1,24]},{"type":"literal","content":"=","location":[1,25]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"literal","content":"[","location":[1,26]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"literal","content":"{","location":[1,27]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"'.'","location":[1,28]}]},{"type":"BASE","content":[{"type":"terminal","terminal":"uppercase","content":"S","location":[1,32]}]}]}]},{"type":"literal","content":"}","location":[1,33]}]},{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"';'","location":[1,35]}]}]}]},{"type":"literal","content":"]","location":[1,38]}]},{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"'?'","location":[1,40]}]}]}]},{"type":"literal","content":".","location":[1,43]}]}]}],23])
    })
    it('parses a wrong simple grammar', () => {
      assert.deepEqual(Grammar(tokenize(`S =; '0'.`), 0), [[{"type":"GRAMMAR","content":[{"type":"RULE","content":[{"type":"terminal","terminal":"uppercase","content":"S","location":[1,0]},{"type":"literal","content":"=","location":[1,2]},{"type":"DISJUNCTION","error":true,"content":[{"type":"CONCATENATION","error":true,"content":[{"type":"BASE","error":true,"content":[{"error":true,"expected":"terminal, nonterminal, quotation or expression between {}, [] or ()","location":[1,3]}]}]}]},{"error":true,"expected":"'.'","location":[1,3]}]}]}],2])
    })
    it('parses a wrong simple grammar with error at end', () => {
      assert.deepEqual(Grammar(tokenize(`S = '0'`), 0), [[{"type":"GRAMMAR","content":[{"type":"RULE","content":[{"type":"terminal","terminal":"uppercase","content":"S","location":[1,0]},{"type":"literal","content":"=","location":[1,2]},{"type":"DISJUNCTION","content":[{"type":"CONCATENATION","content":[{"type":"BASE","content":[{"type":"terminal","terminal":"quotation","content":"'0'","location":[1,4]}]}]}]},{"error":true,"expected":".","location":[1,4]}]}]}],3])
    })
  })
})