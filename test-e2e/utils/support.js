
module.exports.dataTableToPayload = (dataTable) => {
  const values = dataTable.hashes()
  const result = {}
  for (let i = 0; i < values.length; i++) {
    result[values[i].attribute] = parseElement(values[i].type, values[i].value)
  }

  return result
}

function parseElement(type, value) {
  type = type.toLowerCase()
  switch (type) {
    case 'string':
      return value
    case 'boolean':
      return type === 'true'
    case 'integer':
      return parseInt(value, 10)
    case 'float':
      return parseFloat(value)

    default:
      return value
  }
}

module.exports.getVarName = (template) => {
  const match = template.match(/{(.*)}/)
  if (match === null) {
    return null
  }
  return match[1]
}