const db = require('../database/db')

const Product = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      const { name, cost, price, stock } = data

      db.run(
        `INSERT INTO products (name, cost, price, stock)
         VALUES (?, ?, ?, ?)`,
        [name, cost, price, stock],
        function (err) {
          if (err) reject(err)
          resolve(this.lastID)
        }
      )
    })
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const { name, cost, price, stock } = data

      db.run(
        `UPDATE products 
       SET name = ?, cost = ?, price = ?, stock = ?
       WHERE id = ?`,
        [name, cost, price, stock, id],
        function (err) {
          if (err) reject(err)
          resolve()
        }
      )
    })
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM products WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err)
          resolve()
        }
      )
    })
  },

  updateStock: (id, quantity) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE products 
       SET stock = stock - ?
       WHERE id = ? AND stock >= ?`,
        [quantity, id, quantity],
        function (err) {
          if (err) reject(err)
          resolve(this.changes) // retorna se alterou ou não
        }
      )
    })
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM products WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err)
          resolve(row)
        }
      )
    })
  },

  search: (query) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products WHERE name LIKE ?`,
        [`%${query}%`],
        (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        }
      )
    })
  },

  getPaginated: (page = 1, limit = 10, search = '') => {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit
      
      let countSql = 'SELECT COUNT(*) as count FROM products'
      let dataSql = 'SELECT * FROM products'
      let params = []
      
      if (search) {
        countSql += ' WHERE name LIKE ?'
        dataSql += ' WHERE name LIKE ?'
        params.push(`%${search}%`)
      }
      
      dataSql += ' ORDER BY id DESC'
      
      db.get(countSql, params, (err, row) => {
        if (err) return reject(err)
        const totalItems = row ? row.count : 0
        const totalPages = Math.ceil(totalItems / limit)

        db.all(dataSql + ' LIMIT ? OFFSET ?', [...params, limit, offset], (err, rows) => {
          if (err) return reject(err)
          resolve({ products: rows, totalPages, currentPage: parseInt(page) })
        })
      })
    })
  }

}

function getDashboardData() {
    return new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as totalProducts FROM products", [], (err, productResult) => {
            if (err) return reject(err);

            db.get("SELECT COUNT(*) as totalSales FROM sales", [], (err, salesResult) => {
                if (err) return reject(err);

                db.get("SELECT SUM(total) as totalRevenue FROM sales", [], (err, revenueResult) => {
                    if (err) return reject(err);

                    db.all("SELECT * FROM products WHERE stock <= 5", [], (err, lowStockProducts) => {
                        if (err) return reject(err);

                        resolve({
                            totalProducts: productResult.totalProducts || 0,
                            totalSales: salesResult.totalSales || 0,
                            totalRevenue: revenueResult.totalRevenue || 0,
                            lowStockProducts
                        });
                    });
                });
            });
        });
    })
}

module.exports = {
  getAll: Product.getAll,
  create: Product.create,
  update: Product.update,
  delete: Product.delete,
  updateStock: Product.updateStock,
  getById: Product.getById,
  getDashboardData,
  search: Product.search,
  getPaginated: Product.getPaginated
}
