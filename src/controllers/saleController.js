const Sale = require('../models/salemodel')
const Product = require('../models/productModel')

let cart = []

const saleController = {

    async index(req, res) {
        const products = await Product.getAll()

        const total = cart.reduce((sum, item) => sum + item.subtotal, 0)

        const success = req.query.success
        res.render('sale', { title: 'Nova Venda', products, cart, total, success })
    },

    async addToCart(req, res) {
        const { product_id, quantity, custom_price } = req.body
        const products = await Product.getAll()

        const product = products.find(p => p.id == product_id)

        if (product.stock < quantity) {
            // Se for requisição AJAX, retorna JSON
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(400).json({ error: 'Estoque insuficiente!' })
            } else {
                return res.send('Estoque insuficiente!')
            }
        }

        // Usa o preço customizado se fornecido, caso contrário usa o preço padrão
        const price = custom_price ? parseFloat(custom_price) : product.price
        const subtotal = price * quantity

        cart.push({
            product_id: product.id,
            name: product.name,
            quantity: parseInt(quantity),
            price: price,
            subtotal
        })

        // Se for AJAX, retorna sucesso
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ success: true })
        }
        res.redirect('/sales')
    },

    async removeFromCart(req, res) {
        const { index } = req.params
        
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1)
        }

        res.redirect('/sales')
    },

    async finalize(req, res) {

        const total = cart.reduce((sum, item) => sum + item.subtotal, 0)

        const sale_id = await Sale.createSale(total)

        for (const item of cart) {

            const updated = await Product.updateStock(
                item.product_id,
                item.quantity
            )

            if (updated === 0) {
                return res.send('Erro: Estoque insuficiente durante finalização!')
            }

            await Sale.addItem(
                sale_id,
                item.product_id,
                item.quantity,
                item.subtotal
            )
        }

        cart = []

        res.redirect('/sales?success=true')
    },

    async report(req, res) {
        try {
            const { date_from, date_to, page } = req.query;
            const pageNum = page ? parseInt(page) : 1;

            const { sales, totalRevenue, totalProfit, totalSales, totalPages, currentPage } = await Sale.getAllSales(date_from, date_to, pageNum)
            const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
            res.render('report', {
                title: 'Relatório de Vendas',
                sales,
                totalRevenue,
                totalProfit,
                totalSales,
                averageTicket,
                date_from,
                date_to,
                totalPages,
                currentPage
            })
        } catch (err) {
            res.send('Erro ao buscar vendas: ' + err.message)
        }
    }
}

module.exports = saleController