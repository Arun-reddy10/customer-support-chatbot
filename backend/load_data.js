const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/chatbotDB';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({ name: String, sold: Number, stock: Number });
const orderSchema = new mongoose.Schema({ id: Number, status: String });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

function loadProducts() {
  fs.createReadStream('ecommerce-dataset/products.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await Product.create({ name: row.name, sold: Number(row.sold), stock: Number(row.stock) });
    })
    .on('end', () => {
      console.log('Products loaded!');
    });
}

function loadOrders() {
  fs.createReadStream('ecommerce-dataset/orders.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await Order.create({ id: Number(row.id), status: row.status });
    })
    .on('end', () => {
      console.log('Orders loaded!');
      mongoose.disconnect();
    });
}

loadProducts();
loadOrders();