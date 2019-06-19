const uuid = require('uuid/v4')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const config = require('../config')


// Create session store
const store = new MongoDBStore({
  uri: config.mongoConnectUri,
  collection: 'userSessions',
})

// Catch errors
store.on('error', error => console.log(error))


const sessionStore = session({
  store,
  genid: () => uuid(),
  resave: false,
  saveUninitialized: false,
  secret: config.sessionSecret,
  cookie: {
    // Project web path
    path: config.rootPath,
    // 'strict'
    sameSite: true,
    // cannot set secure when using not root path https://t.me/c/1443500416/895
    secure: false,
    // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
})

module.exports = sessionStore
