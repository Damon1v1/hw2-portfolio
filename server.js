const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const serveStatic = require('serve-static');
const session = require('express-session');
const routes = require('./controllers');
const homeRoutes = require('./controllers/home-routes');
const portfolioRoutes = require('./controllers/portfolio-routes');
const contactRoutes = require('./controllers/contact-routes');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3005;

const hbs = exphbs.create();

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(homeRoutes);
app.use(portfolioRoutes);
app.use(contactRoutes);
app.use(serveStatic(path.join(__dirname, 'public')));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});