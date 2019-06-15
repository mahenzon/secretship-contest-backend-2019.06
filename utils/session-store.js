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
    sameSite: true,  // 'strict'
    secure: !!config.isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 1 week
  },
})

module.exports = sessionStore
