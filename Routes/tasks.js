const express = require('express')
const router = express.Router()

const {getAllItems,createItems,deleteItems} = require('../Controllers/tasks')

router.route('/').get(getAllItems).post(createItems)
router.route('/:id').delete(deleteItems)

module.exports = router