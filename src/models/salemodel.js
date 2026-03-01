const db = require('../database/db')

const Sale = {

    createSale: (total) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO sales (total) VALUES (?)`,
                [total],
                function (err) {
                    if (err) reject(err)
                    resolve(this.lastID)
                }
            )
        })
    },

    addItem: (sale_id, product_id, quantity, subtotal) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO sale_items (sale_id, product_id, quantity, subtotal)
         VALUES (?, ?, ?, ?)`,
                [sale_id, product_id, quantity, subtotal],
                function (err) {
                    if (err) reject(err)
                    resolve()
                }
            )
        })
    },

    getAllSales: (date_from, date_to, page = 1, limit = 10) => {
        return new Promise(async (resolve, reject) => {
            const offset = (page - 1) * limit;
            let whereClause = "";
            const params = [];
    
            if (date_from && date_to) {
                whereClause = " WHERE date(created_at) BETWEEN date(?) AND date(?)";
                params.push(date_from, date_to);
            } else if (date_from) {
                whereClause = " WHERE date(created_at) >= date(?)";
                params.push(date_from);
            } else if (date_to) {
                whereClause = " WHERE date(created_at) <= date(?)";
                params.push(date_to);
            }
    
            // Helper para queries promisificadas
            const dbGet = (sql, p) => new Promise((res, rej) => db.get(sql, p, (e, r) => e ? rej(e) : res(r)));
            const dbAll = (sql, p) => new Promise((res, rej) => db.all(sql, p, (e, r) => e ? rej(e) : res(r)));

            try {
                // 1. Totais Gerais (para os Cards)
                const totals = await dbGet(`SELECT COUNT(*) as count, SUM(total) as revenue FROM sales ${whereClause}`, params);
                const totalSales = totals.count || 0;
                const totalRevenue = totals.revenue || 0;
                const totalPages = Math.ceil(totalSales / limit);

                // 2. Lucro Total (precisa de JOIN, ajustando alias da tabela sales para 's')
                let joinWhere = whereClause ? whereClause.replace(/created_at/g, 's.created_at') : "";
                const profitRes = await dbGet(`
                    SELECT SUM(si.subtotal - (p.cost * si.quantity)) as profit
                    FROM sale_items si
                    JOIN products p ON p.id = si.product_id
                    JOIN sales s ON s.id = si.sale_id
                    ${joinWhere}
                `, params);
                const totalProfit = profitRes.profit || 0;

                // 3. Vendas da Página Atual
                const sales = await dbAll(`SELECT * FROM sales ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);

                // 4. Itens das vendas (para exibir detalhes na tabela)
                const salesWithItems = await Promise.all(sales.map(async (sale) => {
                    const items = await dbAll(`
                        SELECT si.*, p.name, p.cost
                        FROM sale_items si
                        JOIN products p ON p.id = si.product_id
                        WHERE si.sale_id = ?
                    `, [sale.id]);

                    sale.items = items;
                    
                    // Calcula lucro individual da venda para exibição
                    let saleProfit = 0;
                    items.forEach(item => {
                        saleProfit += (item.subtotal / item.quantity - item.cost) * item.quantity;
                    });
                    sale.profit = saleProfit;
                    return sale;
                }));

                resolve({ sales: salesWithItems, totalRevenue, totalProfit, totalSales, totalPages, currentPage: parseInt(page) });
            } catch (err) {
                reject(err);
            }
        })
    },

    getDetailedSales: () => {
        return new Promise((resolve, reject) => {
            db.all(
                `
      SELECT 
        s.id as sale_id,
        s.total,
        s.created_at,
        si.quantity,
        si.subtotal,
        p.name as product_name
      FROM sales s
      JOIN sale_items si ON s.id = si.sale_id
      JOIN products p ON p.id = si.product_id
      ORDER BY s.created_at DESC
      `,
                [],
                (err, rows) => {
                    if (err) reject(err)
                    resolve(rows)
                }
            )
        })
    }

}

function getTotalProfit() {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT si.quantity, si.subtotal, p.cost
            FROM sale_items si
            JOIN products p ON p.id = si.product_id
        `, [], (err, items) => {
            if (err) return reject(err);

            let totalProfit = 0;

            items.forEach(item => {
                totalProfit += (item.subtotal / item.quantity - item.cost) * item.quantity;
            });

            resolve(totalProfit);
        });
    })
}

module.exports = {
    createSale: Sale.createSale,
    addItem: Sale.addItem,
    getAllSales: Sale.getAllSales,
    getDetailedSales: Sale.getDetailedSales,
    getTotalProfit
}
