const { createHash, createHmac } = require('crypto')
const config = require('../config')

function checkSignature(token, { hash, ...data }) {
  const secret = createHash('sha256')
    .update(token)
    .digest()
  const checkString = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join('\n')
  const hmac = createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')

  return hmac === hash
}

function checkIntegrity(params) {
  return checkSignature(config.token, params)
}

module.exports = checkIntegrity
