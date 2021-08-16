const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();
const session = require('express-session');

const baseUrl = '/order';

router.get('/', async (req, res) => {
  if (!req.session.fullCart) {
    res.redirect('/cart');
    return;
  }
  if (!req.session.orderInfo) {
    res.redirect(baseUrl + '/info');
    return;
  }
  if (!req.session.payment) {
    res.redirect(baseUrl + '/payment');
    return;
  }
  res.render('order', {pagina:'Order', data: 1 });
});

router.get('/info', async (req, res) => {
  if (!req.session.fullCart) {
    res.redirect('/cart');
    return;
  }
  res.render('order', { pagina:'Order',data: 'info' });
});

router.post('/info', async (req, res) => {
  if (!req.session.orderInfo) {
    req.session.orderInfo = { ...req.body };
  }
  res.redirect(baseUrl);
});

router.get('/payment', async (req, res) => {
  if (!req.session.fullCart) {
    res.redirect('/cart');
    return;
  }
  if (!req.session.orderInfo) {
    res.redirect(baseUrl + '/info');
    return;
  }
  res.render('order', { pagina:'Order',data: 'payment', total: req.session.fullCart.total });
});

router.post('/payment', async (req, res) => {
  if (!req.session.orderInfo) {
    req.session.orderInfo = { ...req.body };
  }
  res.redirect(baseUrl);
});

router.get('/complete', async (req, res) => {
  if (!req.session.fullCart) {
    res.redirect('/cart');
    return;
  }
  const orderInfo = { ...req.session.orderInfo };
  const fullCart = { ...req.session.fullCart };
  const response = await api.get({
    query: {
      type: 'orders',
    }
  });
  const total = response?.total || 0;
  const n = await api.add({
    "title": "order" + (total + 1),
    "type": "orders",
    "metafields": [
      {
        "key": "first_name",
        "title": "First Name",
        "type": "text",
        "value": orderInfo.first_name
      },
      {
        "key": "last_name",
        "title": "Last Name",
        "type": "text",
        "value": orderInfo.last_name
      },
      {
        "key": "email",
        "title": "Email",
        "type": "text",
        "value": orderInfo.email.toLowerCase()
      },
      {
        "key": "city",
        "title": "City",
        "type": "text",
        "value": orderInfo.city
      },
      {
        "key": "address",
        "title": "Address",
        "type": "text",
        "value": orderInfo.address
      },
      {
        "key": "postal_code",
        "title": "Postal Code",
        "type": "number",
        "value": Number(orderInfo.postal_code)
      },
      {
        "key": "order",
        "title": "Order",
        "type": "text",
        "value": JSON.stringify({ products: fullCart.products.map(p => ({ "title": p.title, "id": p.id, "amount": p.amount, "price": p.meta.price })), total: fullCart.total })
      }
    ]
  });
  req.session.fullCart = undefined;
  req.session.orderInfo = undefined;
  req.session.cart = undefined;
  res.render('order', { pagina:'Order',data: 'conform', order: { orderInfo, fullCart } });
});

module.exports = router;