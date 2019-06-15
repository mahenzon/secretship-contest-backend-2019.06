// Like tg-cdn: https://github.com/telegraf/tg-cdn/blob/master/index.js

const mime = require('mime')
const LRU = require('lru-cache')
const hyperquest = require('hyperquest')
const { Telegram } = require('telegraf')
const { Router } = require('express')
const config = require('../config')


const tg = new Telegram(config.token)
const fileInfos = new LRU({ max: 1000 })
const fileLinks = new LRU({ max: 1000, maxAge: 1000 * 60 * 45 })

function sendError(res, status, text) {
  return res.status(status).send(text)
}

function sendNotFound(res) {
  return sendError(res, 404, 'Not Found')
}

const router = Router()

router.get('/:id', async (req, res) => {
  const fileId = req.params.id
  if (!fileId) return sendNotFound(res)
  const fileInfo = fileInfos.get(fileId) || await tg.getFile(fileId).catch(() => null)
  if (!fileInfo) return sendNotFound(res)
  fileInfos.set(fileId, fileInfo)
  const link = fileLinks.get(fileId) || await tg.getFileLink(fileInfo)
  if (!link) return sendNotFound(res)
  fileLinks.set(fileId, link)
  res.setHeader('cache-control', 'public, max-age=31536000')
  res.setHeader('content-type', mime.getType(fileInfo.file_path))
  return hyperquest(link).pipe(res)
})

module.exports = router
