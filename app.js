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
})
const db = mongoose.connection

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
})

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

app.get('/', (req, res) => {
  console.log('sessionID:', req.sessionID)
  console.log('session:', req.session)
  // res.send(`OKs<br>${req.sessionID}`)
  res.json(req.session)
})
// Setup routes
app.use('/api', api)
app.use('/telegram-media', tgMedia)

// Start server
app.listen(config.port, () => {
  console.log('Listening on localhost, port', config.port)
})
