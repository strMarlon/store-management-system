const productModel = require("../models/productModel");
const saleModel = require("../models/salemodel");

async function index(req, res) {
    try {
        const productData = await productModel.getDashboardData();
        const totalProfit = await saleModel.getTotalProfit();

        res.render("dashboard", {
            title: "Dashboard",
            totalProducts: productData.totalProducts,
            totalSales: productData.totalSales,
            totalRevenue: productData.totalRevenue,
            totalProfit,
            lowStockProducts: productData.lowStockProducts
        });
    } catch (err) {
        console.error(err);
        res.send("Erro ao carregar dashboard");
    }
}

module.exports = { index };
