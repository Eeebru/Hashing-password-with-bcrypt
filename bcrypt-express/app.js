const express = require('express');
const app = express();
const morgan = require('morgan');
const usersRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
require("dotenv").config();


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('tiny'));


app.use('/users', usersRoutes);
app.use('/', loginRoutes);


app.use((req, res, next) => {
  let errr =  new Error('Not Found!!');
  errr.status = 404
  next(errr)
});

if (app.get('env' === 'development')) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
};
const PORT = 4000;

app.listen(PORT, ()=> {
  console.log(`Starting the Server at ${PORT}`);
});