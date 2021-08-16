const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();
const session = require('express-session');

router.get('/', async (req, res) => {

  const data = req.session.cart;
  const neew = await Promise.all(
    data.map(async (d) => {
      let res = {};
      const prod = await api.get({
        query: {
          type: 'products',
          id: d[0]
        }
      })
      res['meta'] = prod.objects[0].metadata;
      res['title'] = prod.objects[0].title;
      res['id'] = prod.objects[0].id;
      res['amount'] = d[1];
      return res;
    }));
  if (neew.length <= 0) {
    res.render('cart', { pagina: 'Cart', data: [] });
    return;
  }
  let totalPrice;
  if (neew.length < 2) {
    totalPrice = (neew[0].meta.price * neew[0].amount);
  } else {
    totalPrice = neew.map((n) => (n.meta.price * n.amount)).reduce((a,b)=>a+b);
  }
  req.session.fullCart = { products: neew, total: totalPrice.toFixed(2) };
  res.render('cart', { pagina: 'Cart', data: { products: neew, total: totalPrice } });
});

router.post('/:product', async (req, res) => {
  const { product } = req.params;
  const data = await api.get({
    query: {
      type: 'products',
      slug: product,
    }
  });
  if (data.total !== 1) {
    res.status(404).end();
    return;
  }
  const id = data.objects[0].id;
  if (req.session.cart.find(p => p[0] === id)) {
    req.session.cart.find(p => p[0] === id)[1]++;
  } else {
    req.session.cart.push([id, 1]);
  }
  res.end()
});
router.get('/:productId/:flag', async (req, res) => {
  const { productId, flag } = req.params;
  switch (flag) {
    case 'delete':
      req.session.cart = req.session.cart.filter(p => p[0] !== productId);
      break;
    case '-':
      req.session.cart.find(p => p[0] === productId)[1] > 1 ? req.session.cart.find(p => p[0] === productId)[1]-- : '';
      break;
    case '+':
      req.session.cart.find(p => p[0] === productId)[1]++;
      break;
  }
  res.redirect('/cart');
});

module.exports = router;