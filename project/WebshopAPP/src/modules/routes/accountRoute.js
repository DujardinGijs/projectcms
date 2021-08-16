const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();

const baseUrl = '/account';

router.get('/', async (req, res) => {
  if (req.session.userId) {
    const data = await api.get({
      query: {
        type: 'users',
        id: req.session.userId
      }
    });
    if (data.total === 1) {
      const orders = await api.get({
        query: {
          type: 'orders',
          "metadata.email":data.objects[0].metadata.email
        }
      });
      res.render('account', {pagina:'Account', data: { user: data.objects[0],orders:orders}});
      return;
    }
  }
  res.redirect(baseUrl + '/login');
});

router.get('/login', async (req, res) => {
  if (req.session.userId) {
    res.redirect(baseUrl);
    return;
  }
  res.render('account', { pagina:'Account',data:'login'  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const data = await api.get({
    query: {
      type: 'users',
      'metadata.email': email.toLowerCase(),
      'metadata.password':password
    }
  });
  if (data.total === 1) {
    req.session.userId = data.objects[0].id;
    res.redirect(baseUrl);
    return;
  }
  res.render('account', { pagina:'Account',data:'login'  });
});

router.get('/logout', async (req, res) => {
  req.session.userId = undefined;
  res.redirect(baseUrl);
});

router.get('/register', async (req, res) => {
  if (req.session.userId) {
    res.redirect(baseUrl);
    return;
  }
  res.render('account', { pagina:'Account',data:'register'  });
});

router.post('/register', async (req, res) => {
  const { email, password,fullname } = req.body;
  const data = await api.get({
    query: {
      type: 'users',
      'metadata.email' : email ,
    }
  });
  if (!data) {
    const {total} = await api.get({
      query: {
        type: 'users',
      }
    });
    const n = await api.add({
      "title": "user" + (total +1),
      "type": "users",
      "metafields": [
        {
          "key": "full_name",
          "title": "Full Name",
          "type":"text",
          "value": fullname
        },
        {
          "key": "email",
          "title": "Email",
          "type":"text",
          "value": email.toLowerCase()
        },
        {
          "key": "password",
          "title": "Password",
          "type":"text",
          "value": password
        }
      ]
    });
    if (n.object.id) {
      req.session.userId = n.object.id;
      res.redirect(baseUrl);
      return;
    }
  }
  res.render('account', { pagina:'Account', data:'register'  });
});

module.exports = router;