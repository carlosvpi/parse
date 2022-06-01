module.exports = (inputString, regexps = module.exports.defaultRegexps) => {
  const location = [1, 0]
  const tokens = []
  while (inputString.length) {
    const terminal = Object.keys(regexps).find(key => inputString.match(regexps[key])?.index === 0)
    if (!terminal) throw new Error(`No token terminal defined for input at '${inputString.slice(0, 32)}...', at ${location.join(':')}`)
    const value = inputString.match(regexps[terminal])[0]
    inputString = inputString.slice(value.length)
    if (terminal[0] !== '_') {
      tokens.push({ terminal, value, location: [...location] })
    }
    const rows = value.split('\n')
    location[0] += rows.length - 1
    location[1] = rows.length > 1 ? rows[rows.length - 1].length : location[1] + rows[0].length
  }
  return tokens
}

module.exports.defaultRegexps = {
  _ws: /\s+/,
  _comment: /#[^\n]*/,
  lowercase: /[a-z][a-zA-z0-9_]*/,
  uppercase: /[A-Z_][a-zA-z0-9_]*/,
  num: /[0-9]+/,
  quotation: /(["'])(?:(?=(\\?))\2.)*?\1/,
  char: /./
}
