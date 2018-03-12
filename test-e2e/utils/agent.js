const request = require('request-promise')

class Agent {
  constructor (username) {
    this.username
    // TODO: make this a configuration
    this.baseUrl = 'http://localhost:3000'

    this.lastResponse = null
    this.responses = []
  }

  get (uri, opts) {
    return this.send(`${this.baseUrl}/${uri}`, 'GET', opts)
  }

  post (uri, body, opts) {
    return this.send(`${this.baseUrl}/${uri}`, 'POST', opts, body)
  }

  put (uri, body, opts) {
    return this.send(`${this.baseUrl}/${uri}`, 'PUT', opts, body)
  }

  delete (uri, body, opts) {
    return this.send(`${this.baseUrl}/${uri}`, 'DELETE', opts, body)
  }

  send (uri, method, opts, body) {
    return request({
      json: true,
      simple: false,
      resolveWithFullResponse: true,
      method,
      uri,
      body,
      auth: opts && opts.auth,
      headers: opts && opts.headers,
      jar: this.cookieJar,
      followRedirect: opts && opts.followRedirect
    }).then((res) => {
     // console.log('>>>>>>>>>>', uri,method,body, res.body, res.statusCode)
      this.lastResponse = res
      this.responses.push(res)
    })
  }
}

const agents = {}
module.exports.getAgent = (username) => {
  if (!username) {
    username = '__default'
  }

  if (!agents[username]) {
    agents[username] = new Agent()
  }
  return agents[username]
}