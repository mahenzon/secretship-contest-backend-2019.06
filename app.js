const express = require('express')
const bodyParser = require('body-parser')
const sessionStore = require('./utils/session-store')

const config = require('./config')
const tgMedia = require('./routes/telegram-media')
const api = require('./routes/api')


const app = express()

// Add body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setup app to use session
app.use(sessionStore)

// Setup routes
app.use('/api', api)
app.use('/telegram-media', tgMedia)

// Start server
app.listen(config.port, () => {
  console.log('Listening on localhost, port', config.port)
})
