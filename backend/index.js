const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


const products = require('./ecommerce-dataset/products.json');
const orders = require('./ecommerce-dataset/orders.json');

app.get('/top-products', (req, res) => {
  // Return top 5 sold
  const sorted = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  res.json(sorted);
});

app.get('/order-status/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  res.json(order || { error: 'Order not found' });
});

app.get('/stock/:name', (req, res) => {
  const product = products.find(p => p.name.toLowerCase().includes(req.params.name.toLowerCase()));
  res.json(product ? { name: product.name, stock: product.stock } : { error: 'Product not found' });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
