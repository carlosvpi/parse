module.exports = {}

const isNodeError = module.exports.isNodeError = ([node]) => node && node.error

const error = module.exports.error = (expected, location) => ({ error: true, expected, location })

const concat = module.exports.concat = (firstRule, ...rules) => (input, index = 0) => {
  const result = []
  const firstOutput = firstRule(input, index)
  if (isNodeError(firstOutput[0])) return firstOutput
  index = firstOutput[1]
  result.push(...firstOutput[0])
  for (let rule of rules) {
    const output = rule(input, index)
    index = output[1]
    result.push(...output[0])
  }
  return [result, index]
}

const disjunction = module.exports.disjunction = (disjName, ...rules) => (input, index = 0) => {
  if (index >= input.length) return [[error(disjName, input[input.length - 1] && input[input.length - 1].location)], index]
  for (let rule of rules) {
    const output = rule(input, index)
    if (!isNodeError(output[0])) return output
  }
  return [[error(disjName, input[index].location)], index]
}

const closure = module.exports.closure = rule => (input, index = 0) => {
  const result = []
  do {
    const output = rule(input, index)
    if (isNodeError(output[0])) return [result, index]
    index = output[1]
    result.push(...output[0])
  } while (true)
  return [result, index]
}

const option = module.exports.option = rule => (input, index = 0) => {
  const output = rule(input, index)
  if (!isNodeError(output[0])) return output
  return [[], index]
}

const literal = module.exports.literal = lit => (input, index = 0) => {
  if (index >= input.length) return [[error(lit, input[input.length - 1] && input[input.length - 1].location)], index]
  if (input[index].value === lit) return [[{ type: 'literal', content: input[index].value, location: input[index].location }], index + 1]
  return [[error(`'${lit}'`, input[index].location)], index]
}

const terminal = module.exports.terminal = term => (input, index = 0) => {
  if (index >= input.length) return [[error(`a ${term}`, input[input.length - 1] && input[input.length - 1].location)], index]
  if (input[index].terminal === term) return [[{ type: 'terminal', terminal: term, content: input[index].value, location: input[index].location }], index + 1]
  return [[error(`a ${term}`, input[index].location)], index]
}
