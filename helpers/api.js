function sendError(status, text, res, err) {
  if (err) {
    console.log('There was an error!:', err)
  }
  return res.status(status).json({ error: text })
}

function sendServerError(text, res, err) {
  return sendError(500, text, res, err)
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
