function sendError(status, text, args, res, err) {
  if (err) {
    console.log('There was an error!:', err)
  }
  const json = { error: text }
  if (args) {
    json.args = args
  }
  return res.status(status).json(json)
}

function sendServerError(text, res, err) {
  return sendError(500, text, null, res, err)
}

function redirectWithError(errorText, res) {
  const text = encodeURIComponent(errorText)
  res.redirect(`/#/show-error?text=${text}`)
}

module.exports = {
  sendError,
  sendServerError,
  redirectWithError,
}
