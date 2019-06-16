const checkIntegrity = require('../utils/tg-check-integrity')
const User = require('../models/user')
const {
  sendError,
  sendServerError,
} = require('./api')

const ONE_DAY = 1000 * 60 * 60 * 24


function preparedUser({
  createdAt,
  user_id,
  username,
  first_name,
  last_name,
  language_code,
  profile_photo_id,
}) {
  return {
    user_id,
    username,
    first_name,
    last_name,
    language_code,
    profile_photo_id,
    join_date: createdAt.getTime(),
  }
}

function sendExistingUser(res, user) {
  return res.json({
    user: preparedUser(user),
  })
}

function findAndSendUser(res, user_id) {
  if (Number.isNaN(Number(user_id))) {  // https://github.com/airbnb/javascript#standard-library
    return sendError(400, `ID cannot be like '${user_id}'!`, res)
  }
  User.findOne({ user_id }, (err, user) => {
    if (err) {
      return sendServerError('Error fetching database!', res, err)
    }
    if (!user) {
      return sendError(404, `User with id ${user_id} not found`, res)
    }
    console.log('User is', user)
    return sendExistingUser(res, user)
  })
}

function getAuthorizedUsers(res) {
  // TODO: offset, limit
  User.find({}, (err, users) => {
    if (err) {
      return sendServerError('Error fetching database!', res, err)
    }
    return res.json({ users: users.map(preparedUser) })
  })
}

// Login
async function loginUser(req, res, params) {
  if (!checkIntegrity(params)) {
    req.session.destroy()
    return sendError(401, 'Not Authorized', res)
  }
  const now = new Date()
  const authDate = params.auth_date * 1000
  if (now - authDate > ONE_DAY) {
    req.session.destroy()
    return sendError(401, 'Session expired, please click login button again', res)
  }

  const user_id = params.id
  req.session.userId = user_id  // mark as authorized
  return findAndSendUser(res, user_id)
}

// Logout
async function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return sendServerError('Error logging you out. Please try again', res, err)
    }
    res.clearCookie()
    return res.json({})
  })
}


const userHelper = {
  sendExistingUser,
  findAndSendUser,
  getAuthorizedUsers,
  loginUser,
  logoutUser,
}

module.exports = userHelper
