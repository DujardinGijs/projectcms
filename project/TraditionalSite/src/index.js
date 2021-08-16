const express = require('express');
const app = express();
const Cosmic = require('cosmicjs');
const api = Cosmic();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const bucket = api.bucket({
  slug: 'headlesscms-production',
  read_key: 'A5UgOI91Ur1cnUG0dLIw24DTeWgC4Sw9fNOHLZhWBUrXR4QCZ3',
  write_key: 'xHOtNbkDtoyofUwE95hT2Beq3036VscWoystkW7hVTZY60buPr'
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  res.render('index', {});
});

app.get('/Blog', async (req, res) => {
  const data = await bucket.getObjects({
    query: {
      type: 'blogs'
    }
  });
  const posts = data.objects;
  res.render('blog', { data: { blogs: posts } });
});

app.get('/Blog/:blog', async (req, res) => {
  const { blog } = req.params;
  const data = await bucket.getObjects({
    query: {
      type: 'blogs',
      slug: blog
    }
  });
  const posts = data.objects[0];
  res.render('post', { data: { post: posts } });
});

app.get('/info/:page', async (req, res) => {
  const { page } = req.params;
  const data = await bucket.getObjects({
    query: {
      type: 'pages',
      slug: page
    }
  });
  if (data.total <= 0) {
    res.status(404);
    return;
  }
  res.render('page', { data: data.objects[0] });
});

app.get('*', async (req, res) => {
  res.render('index', {});
});

app.post('/contact', async (req, res) => {
  const data = await bucket.getObjects({
    query: {
      type: 'contact-uses'
    }
  });
  bucket.addObject({
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
        "value": req.body.email
      },
      {
        "title": "Message",
        "key": "message",
        "type": "text",
        "value": req.body.message
      }
    ]
  });
  res.redirect('/info/contact-us');
});

app.listen(PORT, () => {
  console.log('Your Cosmic app is running at http://localhost:' + PORT)
});