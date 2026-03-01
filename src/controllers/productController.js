const Product = require('../models/productModel')

const productController = {

  async index(req, res) {
    const { search } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const { products, totalPages, currentPage } = await Product.getPaginated(page, limit, search)
    res.render('products', { title: 'Produtos', products, search, totalPages, currentPage })
  },

  async create(req, res) {
    const { name, cost, price, stock } = req.body

    await Product.create({
      name,
      cost: parseFloat(cost),
      price: parseFloat(price),
      stock: parseInt(stock)
    })

    res.redirect('/products')
  },

  async editForm(req, res) {
    const products = await Product.getAll()
    const product = products.find(p => p.id == req.params.id)
    res.render('editProduct', { title: 'Editar Produto', product })
  },

  async update(req, res) {
    const { name, cost, price, stock } = req.body
    const { id } = req.params

    await Product.update(id, {
      name,
      cost: parseFloat(cost),
      price: parseFloat(price),
      stock: parseInt(stock)
    })

    res.redirect('/products')
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      await Product.delete(id)
      res.redirect('/products')
    } catch (err) {
      res.send("Erro ao excluir produto: " + err.message)
    }
  }
}

module.exports = productController