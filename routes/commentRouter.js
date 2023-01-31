const express = require('express')
const router = express.Router()

const commentController = require('../controllers/commentController')

router
.route('/')
.get( commentController.getComments )
.post(commentController.createComment)


module.exports = router