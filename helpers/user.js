const User = require('../models/user')


function sendServerError(res, err) {
  console.log('There was an error!:', err)
  return res.status(500).json({ error: 'Error fetching database!' })
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

function findAndSendUser(res, user_id) {
  if (Number.isNaN(Number(user_id))) {  // https://github.com/airbnb/javascript#standard-library
    return res.status(400).json({ error: `ID cannot be like '${user_id}'!` })
  }
  User.findOne({ user_id }, (err, user) => {
    if (err) {
      return sendServerError(res, err)
    }
    if (!user) {
      return res.status(404).json({ error: `User with id ${user_id} not found` })
    }
    console.log('User is', user)
    return sendExistingUser(res, user)
  })
}

function getAuthorizedUsers(res) {
  // TODO: offset, limit
  User.find({}, (err, users) => {
    if (err) {
      return sendServerError(res, err)
    }
    return res.json({ users: users.map(preparedUser) })
  })
}

const userHelper = {
  sendExistingUser,
  findAndSendUser,
  getAuthorizedUsers,
}

module.exports = userHelper
