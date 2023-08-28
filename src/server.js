require('dotenv').config();
const initModel = require('./models/initModels');
const app = require('./app');
const { db } = require('./database/config.js');

const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('running a task every minute')
}),


  db.authenticate()
    .then(() => console.log('Database connected 👌'))
    .catch((err) => console.log(err));
initModel();
db.sync({ force: false })
  .then(() => console.log('Database sync 😎'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is up on port ${PORT}`);
});
