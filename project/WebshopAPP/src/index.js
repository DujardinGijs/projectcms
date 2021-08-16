const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const session = require('express-session');

const blogRoute = require('./modules/routes/blogsRoute');
const productRoute = require('./modules/routes/productsRoute');
const contactRoute = require('./modules/routes/contactRoute');
const cartRoute = require('./modules/routes/cartRoute');
const orderRoute = require('./modules/routes/orderRoute');
const accountRoute = require('./modules/routes/accountRoute');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'i/MDiTXCiaDuqu+yQ78KBGgn0tC3KTnnzeRKb+b/LM8=',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use('*', async (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.get('/', async (req, res) => {
  res.render('index', {pagina:'Home'});
});
app.use('/blog', blogRoute);
app.use('/products', productRoute);
app.use('/contact', contactRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/account', accountRoute);
app.get('*', async (req, res) => {
  res.render('index', {pagina:'Home'});
});

app.listen(PORT, () => {
  console.log('Your Cosmic app is running at http://localhost:' + PORT)
});