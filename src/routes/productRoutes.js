const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

router.get('/', productController.index)
router.post('/create', productController.create)

router.get('/edit/:id', productController.editForm)
router.post('/update/:id', productController.update)

// Permite deletar tanto via Link (GET) quanto via Formulário (POST)
router.get('/delete/:id', productController.delete)
router.post('/delete/:id', productController.delete)

module.exports = router