const {
  concat,
  disjunction,
  closure,
  option,
  literal,
  terminal,
  isNodeError
} = require('../src/primitives.js')

const astNode = (type, rule) => (input, index = 0) => {
  const output = rule(input, index)
  if (isNodeError(output[0])) return [[{ type, error: true, content: output[0] }], output[1]]
  const [content, newIndex] = output
  return [[{ type, content }], newIndex]
}


/*
Grammar = { Rule }.
Rule = uppercase '=' Disjunction '.'.
Disjunction = Concatenation { '|' Concatenation }.
Concatenation = Base { Base }.
Base = quotation
  | '{' Disjunction '}'
  | '[' Disjunction ']'
  | '(' Disjunction ')'
  | lowercase
  | uppercase
*/

const BASE = module.exports.BASE = 'BASE'
const CONCATENATION = module.exports.CONCATENATION = 'CONCATENATION'
const DISJUNCTION = module.exports.DISJUNCTION = 'DISJUNCTION'
const RULE = module.exports.RULE = 'RULE'
const GRAMMAR = module.exports.GRAMMAR = 'GRAMMAR'

const Base = (input, index) => astNode(BASE, disjunction('terminal, nonterminal, quotation or expression between {}, [] or ()',
  terminal('quotation'),
  concat(literal('{'), Disjunction, literal('}')),
  concat(literal('['), Disjunction, literal(']')),
  concat(literal('('), Disjunction, literal(')')),
  terminal('lowercase'),
  terminal('uppercase')
))(input, index)
const Concatenation = astNode(CONCATENATION, concat(Base, closure(Base)))
const Disjunction = astNode(DISJUNCTION, concat(Concatenation, closure(concat(literal('|'), Concatenation))))
const Rule = astNode(RULE, concat(terminal('uppercase'), literal('='), Disjunction, literal('.')))
const Grammar = module.exports.Grammar = astNode(GRAMMAR, closure(Rule))
