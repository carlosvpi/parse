const assert = require('assert')
const synthesize = require('../src/synthesize.js')

const PLUS = '+'
const MINUS = '-'
const PROD = '*'
const DIV = '/'
const NUM = '#'

const createTree = (type, ...content) => ({ type, content })
const createLeaf = value => ({ value })
const createError = (value) => ({ error: true, expected: value, location: [0, 0] })

const actionHash = {
  [PLUS]: (a, b) => a + b,
  [MINUS]: (a, b) => a - b,
  [PROD]: (a, b) => a * b,
  [DIV]: (a, b) => a / b,
  [NUM]: () => a / b,
}


describe('synthesize', () => {
  it('synthesizes a tree without errors', () => {
    const tree = createTree(
      PLUS,
      createTree(
        PROD,
        createTree(
          MINUS,
          createLeaf(6),
          createLeaf(4)
        ),
        createLeaf(7)
      ),
      createLeaf(6),
    )
    assert.deepEqual(synthesize(actionHash)(tree), [20, []])
  })
  it('synthesizes a tree with errors', () => {
    const tree = createTree(
      PLUS,
      createTree(
        PROD,
        createTree(
          MINUS,
          createLeaf(6),
          createError('num1')
        ),
        createLeaf(7)
      ),
      createError('num2'),
    )
    assert.deepEqual(synthesize(actionHash)(tree), [42,[{"error":true,"expected":"num1","location":[0,0]},{"error":true,"expected":"num2","location":[0,0]}]])
  })
})
