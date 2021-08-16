const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();

router.get('/all-products', async (req, res) => {
  const data = await api.get({
    query: {
      type: 'products'
    }
  });
  res.render('products', { pagina:'Products',data:data  });
});

router.get('/:product', async (req, res) => {
  const { product } = req.params;
  const data = await api.get({
    query: {
      type: 'products',
      slug: product
    }
  });
  res.render('product',{ pagina:'Products',data:data  });
});

module.exports = router;