const { Router } = require('express')
const checkIntegrity = require('../utils/tg-check-integrity')

const router = Router()


// Login
router.get('/login', async (req, res) => {
  if (checkIntegrity(req.query)) {
    // Authorize user

    res.send('OK')
  } else {
    res.send('Not Authorized!')
  }
})

// Get user
router.get('/user/:id', async (req, res) => {
})

// Get authorized users
router.get('/users/', async (req, res) => {
  // TODO: Consider using offset to load more...
})

module.exports = router
