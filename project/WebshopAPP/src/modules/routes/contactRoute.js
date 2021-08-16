const express = require('express');
const router = express.Router();
const Api = require('../api/cosmicApi');
const api = new Api();

router.get('/:page', async (req, res) => {
  const { page } = req.params;
  const data = await api.get({
    query: {
      type: 'pages',
      slug: page
    }
  });
  if (!data) {
    res.status(404).end();
    return;
  }
  res.render('page', { pagina:'Contact',data: data.objects[0] });
});

router.post('/', async (req, res) => {
  const data = await api.get({
    query: {
      type: 'contact-uses'
    }
  });
  api.add({
    "title": "message" + data.total,
    "type": "contact-uses",
    "metafields": [
      {
        "title": "Full Name",
        "key": "full_name",
        "type": "text",
        "value": req.body.name
      },
      {
        "title": "Email",
        "key": "email",
        "type": "text",
        "value": req.body.email.toLowerCase()
      },
      {
        "title": "Message",
        "key": "message",
        "type": "text",
        "value": req.body.message
      }
    ]
  });
  res.redirect('/contact/contact-us');
});


module.exports = router;