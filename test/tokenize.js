const assert = require('assert')
const tokenize = require('../src/tokenize.js')

describe('tokenize', () => {
  it('tokenizes the input "this is 1 Text"', () => {
    assert.deepEqual(tokenize('this is 1 Text'), [{"terminal":"lowercase","value":"this","location":[1,0]},{"terminal":"lowercase","value":"is","location":[1,5]},{"terminal":"num","value":"1","location":[1,8]},{"terminal":"uppercase","value":"Text","location":[1,10]}])
  })
  it('tokenizes the input ""', () => {
    assert.deepEqual(tokenize(''), [])
  })
  it('tokenizes the input "this is a text" with different token types', () => {
    assert.deepEqual(tokenize('this is 1 Text', { this: /this/, _is: /is/, a: /1/, text: /Text/, ws: /\s/ }), [{"terminal":"this","value":"this","location":[1,0]},{"terminal":"ws","value":" ","location":[1,4]},{"terminal":"ws","value":" ","location":[1,7]},{"terminal":"a","value":"1","location":[1,8]},{"terminal":"ws","value":" ","location":[1,9]},{"terminal":"text","value":"Text","location":[1,10]}])
  })
  it('tokenizes the input "this is a text" with no token types', () => {
    try {
      tokenize('this is 1 Text', {})
    } catch (e) {
      assert.equal(e.message, "No token terminal defined for input at 'this is 1 Text...', at 1:0")
    }
  })
  it('tokenizes a multi-line input with quotations and comments', () => {
    assert.deepEqual(tokenize(`with 'single' #comment
quotes and "double"
ones`), [{"terminal":"lowercase","value":"with","location":[1,0]},{"terminal":"quotation","value":"'single'","location":[1,5]},{"terminal":"lowercase","value":"quotes","location":[2,0]},{"terminal":"lowercase","value":"and","location":[2,7]},{"terminal":"quotation","value":"\"double\"","location":[2,11]},{"terminal":"lowercase","value":"ones","location":[3,0]}])
  })
})
