const express = require('express')
const router = express.Router()

const isAuthorized = require('../validators/isAuthorized')
const restrictAdmin = require('../validators/restrictAdmin')
const postController = require('../controllers/postController')

router
.route('/')
.get( postController.getPosts )
.post(postController.createPost)

router
.route('/categories')
.get(postController.getCategories)


router
.route('/:slug')
.get(postController.getPost)

router
.route('/search/:searchterm')
.get(postController.search)

router
.route('/delete/:id')
.post(isAuthorized, restrictAdmin, postController.deletePost)

router
.route('/publish/:id')
.post(isAuthorized, restrictAdmin, postController.publishPost)



module.exports = router