const express = require('express')
const router = express.Router()

const {info,user} = require('../Controllers/tasks')

router.route('/login').post(user)
router.route('/dashboard').get(info)

module.exports = router