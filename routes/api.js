const { Router } = require('express')

const {
  findAndSendUser,
  getAuthorizedUsers,
  loginUser,
  logoutUser,
} = require('../helpers/user')

const router = Router()


router.get('/login', async (req, res) => loginUser(req, res, req.query))
router.post('/login', async (req, res) => loginUser(req, res, req.body))

router.get('/logout', logoutUser)
router.post('/logout', logoutUser)


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
router.get('/users', async (req, res) => {
  return getAuthorizedUsers(res, req.query)
})

module.exports = router
