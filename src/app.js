const express = require('express')
const path = require('path')

const dashboardRoutes = require('./routes/dashboardRoutes')
const productRoutes = require('./routes/productRoutes')
const saleRoutes = require('./routes/saleRoutes')

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Helper global para formatar moeda (R$) em todas as views
app.locals.formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', dashboardRoutes)
app.use('/products', productRoutes)
app.use('/sales', saleRoutes)

app.get('/', (req, res) => {
  res.redirect('/products')
})

module.exports = app