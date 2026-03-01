const express = require('express')
const router = express.Router()

const saleController = require('../controllers/saleController')

router.get('/', saleController.index)
router.post('/add', saleController.addToCart)
router.get('/remove/:index', saleController.removeFromCart)
router.post('/finalize', saleController.finalize)
router.get('/report', saleController.report)

module.exports = router
