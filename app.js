const express = require('express');
const ejs = require('ejs');
const dbCon = require('./app/config/dbCon');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const flash = require('connect-flash');
const methodOverride = require('method-override');
const session = require('express-session');

const app = express();
app.use(session({
  secret: 'hello world', 
  resave: false,
  saveUninitialized: false
}));
dbCon();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(methodOverride('_method'));
app.use(flash());

const adminRouter=require('./app/routes/adminRoutes')
 app.use(adminRouter)

const customerRouter=require('./app/routes/customerRoutes')
app.use(customerRouter)

const port = 3005;
app.listen(port, () => {
    console.log(`server running port ${port}`);
});
