const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config({ path: './config.env' });
const app = require('./app');


mongoose.set("strictQuery", false)
// , {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// }

mongoose
  .connect(process.env.DATABASE_LOCAl)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

