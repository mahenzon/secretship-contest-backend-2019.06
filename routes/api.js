const { Router } = require('express')

const checkIntegrity = require('../utils/tg-check-integrity')
const { findAndSendUser, getAuthorizedUsers } = require('../helpers/user')

const router = Router()
const ONE_DAY = 1000 * 60 * 60 * 24


async function login(req, res, params) {
  if (!checkIntegrity(params)) {
    return res.json({ error: 'Not Authorized' })
  }
  const now = new Date()
  const authDate = params.auth_date * 1000
  if (now - authDate > ONE_DAY) {
    return res.json({ error: 'Session expired, please click login button again' })
  }

  const user_id = params.id
  req.session.userId = user_id  // mark as authorized
  return findAndSendUser(res, user_id)
}

router.get('/login', async (req, res) => login(req, res, req.query))
router.post('/login', async (req, res) => login(req, res, req.body))


async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      res.send('ERROR')
      return
    }
    res.clearCookie()
    res.send('SUCCESS LOGOUT')
  })
}

router.get('/logout', logout)
router.post('/logout', logout)


// Get the logged in user
router.get('/getMe', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'User is not authorized' })
  }
  return findAndSendUser(res, req.session.userId)
})

// Get user
router.get('/user/:id', async (req, res) => findAndSendUser(res, req.params.id))

// Get authorized users
router.get('/users/', async (req, res) => {
  // TODO: Consider using offset to load more...
  return getAuthorizedUsers(res)
})

module.exports = router
