const uuid = require('uuid/v4')
const express = require('express')
// const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoDBStore = require('connect-mongodb-session')(session)

const config = require('./config')
const tgMedia = require('./routes/telegram-media')
const api = require('./routes/api')


const app = express()

// Add body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Create session store
const store = new MongoDBStore({
  uri: config.mongoConnectUri,
  collection: 'userSessions',
})

// Catch errors
store.on('error', error => console.log(error))

// Setup app to use session
app.use(session({
  store,
  genid: () => uuid(),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 1,  // 1 day
  },
}))


// Setup routes
app.use('/api', api)
app.use('/telegram-media', tgMedia)

// Start server
app.listen(config.port, () => {
  console.log('Listening on localhost, port', config.port)
})
