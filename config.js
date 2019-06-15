const { resolve } = require('path')
const { randomFillSync } = require('crypto')
const { existsSync, readFileSync, writeFile } = require('fs')
const dotenv = require('dotenv')

dotenv.config()


function readSecret() {
  const secretPath = resolve(process.env.SECRET_FILEPATH || 'sessionSecret')
  if (existsSync(secretPath)) {
    return readFileSync(secretPath, 'utf8')
  }
  const secret = randomFillSync(Buffer.alloc(42)).toString('hex')
  writeFile(secretPath, secret, err => !err || console.log(err))
  return secret
}


module.exports = {
  token: process.env.BOT_TOKEN,
  domain: process.env.DOMAIN,
  hookPath: process.env.WEBHOOK_PATH || null,
  port: process.env.PORT || 3001,
  mongoConnectUri: process.env.MONGO_URI || 'mongodb://localhost/contest-bot',
  sessionSecret: process.env.SECRET || readSecret(),
}
