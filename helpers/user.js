const checkIntegrity = require('../utils/tg-check-integrity')
const User = require('../models/user')
const {
  sendError,
  sendServerError,
} = require('./api')

const ONE_DAY = 1000 * 60 * 60 * 24


async function addOrUpdateUser(userInfo) {
  const user_id = userInfo.id
  const newUser = {
    user_id,
    username: userInfo.username,
    last_name: userInfo.last_name,
    first_name: userInfo.first_name,
    photo_url: userInfo.photo_url,
  }
  const options = {
    upsert: true,
    setDefaultsOnInsert: true,
  }
  try {
    await User.findOneAndUpdate({ user_id }, newUser, options)
  } catch (error) {
    console.error('Error adding new user!', userInfo, error)
  }
}


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

async function findAndSendUser(res, user_id) {
  if (Number.isNaN(Number(user_id))) {  // https://github.com/airbnb/javascript#standard-library
    return sendError(400, `ID cannot be like '${user_id}'!`, res)
  }

  try {
    const user = await User.findOne({ user_id })
    if (user) {
      return sendExistingUser(res, user)
    }
  } catch (error) {
    return sendServerError('Error fetching database!', res, error)
  }

  return sendError(404, `User with id ${user_id} not found`, res)
}

async function getAuthorizedUsers(res, params) {
  let {
    offset = 0,
    limit = 25,
  } = params
  offset = Number(offset)
  limit = Number(limit)
  if (Number.isNaN(offset) || Number.isNaN(limit)) {
    return sendServerError("Both 'offset' and 'limit' params have to be numeric!", res)
  }
  try {
    const count = await User.countDocuments()
    const users = await User.find().skip(offset).limit(limit)
    return res.json({ users: users.map(preparedUser), total: count })
  } catch (error) {
    return sendServerError('Error fetching database!', res, error)
  }
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

  addOrUpdateUser(params)
  req.session.userId = params.id  // mark as authorized
  res.redirect('/')
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
