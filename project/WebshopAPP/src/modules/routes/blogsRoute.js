const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();

router.get('/', async (req, res) => {
  const data = await api.get({
    query: {
      type: 'blogs'
    }
  });
  const posts = data.objects;
  res.render('blogs', { pagina:'Blog',data: data });
});

router.get('/:blog', async (req, res) => {
  const { blog } = req.params;
  const data = await api.get({
    query: {
      type: 'blogs',
      slug: blog
    }
  });
  const posts = data.objects[0];
  res.render('post', { pagina:'Blog',data:  data});
});

module.exports = router;