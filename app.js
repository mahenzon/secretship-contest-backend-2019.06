const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const sessionStore = require('./utils/session-store')

const config = require('./config')
const tgMedia = require('./routes/telegram-media')
const api = require('./routes/api')


// Setup mongo connection
mongoose.connect(config.mongoConnectUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  reconnectTries: Number.MAX_VALUE,
})
const db = mongoose.connection


// Check for db errors
db.on('error', (err) => {
  console.error(err)
})


const app = express()

// Add body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setup app to use session
app.use(sessionStore)


// Setup routes
app.use(`${config.rootPath}/api`, api)
app.use(`${config.rootPath}/telegram-media`, tgMedia)


// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
  // Start server only after DB connect
  app.listen(config.port, () => {
    console.log('Listening on localhost, port', config.port)
  })
})
