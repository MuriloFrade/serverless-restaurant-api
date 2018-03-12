

require('../scripts/config')
const { Before, BeforeAll, After, Given, When, Then } = require('cucumber')
const pluralize = require('pluralize')
const { assert, expect } = require('chai')

const {
  dataTableToPayload,
  getVarName } = require('../utils/support')
const { getAgent } = require('../utils/agent')
const Seed = require('../utils/seed')

const cache = {}
Seed.run().then(createSteps).catch(console.error)

function createSteps () {

  /**
   * Creation
   */
  When('I request to create a(n) {string}', (resource, cb) => {
    getAgent().post(pluralize(resource), {}).then(cb)
  })

  When('I request to create a(n) {string} with:', (resource, dataTable, cb) => {
    getAgent().post(pluralize(resource), dataTableToPayload(dataTable)).then(cb)
  })

  /**
   * Retrieval
   */
  When('I request a {string} {string}', (resource, idOrVariable, cb) => {
    const varName = getVarName(idOrVariable)
    const id = varName === null ? idOrVariable : cache[varName]
    getAgent().get(`${pluralize(resource)}/${id}`).then(cb)
  })

  When('I request a list of {string}', (resource, cb) => {
    getAgent().get(`${pluralize(resource)}`).then(cb)
  })
  /**
   * Deletion
   */
  Given('I request to delete the {string} {string}', (resource, idOrVariable, cb) => {
    const varName = getVarName(idOrVariable)
    const id = varName === null ? idOrVariable : cache[varName]
    getAgent().delete(`${pluralize(resource)}/${id}`).then(cb)
  })

  /**
   * Response Inspection
   */
  Then('the response exist(s) the parameter(s) {string}', (parametersList) => {
    const parameters = parametersList.split(',')
    const body = getAgent().lastResponse.body
    parameters.forEach(p => assert.exists(body[p]))
  })

  Then('the response exist(s) the parameter(s) {string} in the attribute {string}', (parametersList, attribute) => {
    const parameters = parametersList.split(',')
    const body = getAgent().lastResponse.body
    assert.exists(body[attribute])
    parameters.forEach(p => assert.exists(body[attribute][p]))
  })
  Then(
    'the response parameter {string} in the attribute {string} is {string}',
    (param, responseAttr, idOrVariable) => {
      console.log('=====', param, responseAttr, idOrVariable)
      const value = getVarName(idOrVariable) === null
        ? idOrVariable
        : cache[getVarName(idOrVariable)]
      assert.equal(getAgent().lastResponse.body[responseAttr][param], value)
    })

  Then('the response attribute {string} is a list of {int} items', (attribute, length) => {
    expect(getAgent().lastResponse.body[attribute]).to.be.an('array')
    expect(getAgent().lastResponse.body[attribute]).to.have.lengthOf(length)
  })

  /**
   * Status Inspection
   */
  Then('the request is/was successful\( and an item is/was {word})', (word) => {
    const status = getAgent().lastResponse.statusCode
    assert.isAtLeast(status, 200)
    assert.isBelow(status, 400)
    if (word === 'created') {
      assert.strictEqual(status, 201)
    }
  })

  Then('the request failed because it was invalid', () => {
    assert.strictEqual(getAgent().lastResponse.statusCode, 400)
  })

  /**
   * Attribute saving and re-use
   */
  When('I save {string} as {string} from \(the attribute {string} of) the response', (property, identifier, fromAttribute) => {
    const body = getAgent().lastResponse.body
    if (fromAttribute) {
      cache[identifier] = body[fromAttribute][property]
      return
    }
    cache[identifier] = body[property]
  })

  /**
   * Modification
   */
  When('I request to modify the {string} {string} with:', (resource, idOrVariable, dataTable, cb) => {
    const id = getVarName(idOrVariable) === null
      ? idOrVariable
      : cache[getVarName(idOrVariable)]
    getAgent().put(`${pluralize(resource)}/${id}`, dataTableToPayload(dataTable)).then(cb)
  })

}
