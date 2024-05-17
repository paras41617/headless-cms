const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const entityRoutes = require('./routes/entityRoutes');
const sequelize = require('./config/config');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', entityRoutes);

require('dotenv').config();

sequelize.authenticate().then(() => {
  console.log('Database connected...');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
