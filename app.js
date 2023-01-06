const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');

app.use(bodyParser.json({ extended: false }));

app.use(cors());

const expenceRoutes = require('./routes/expence');
const User = require('./models/user');



app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/user', expenceRoutes);


const port = 3000;

sequelize
  .sync()
  .then(() => {
    console.log(`listening to the port:${port}`);
    app.listen(port);
  })
  .catch(err => console.log(err))

