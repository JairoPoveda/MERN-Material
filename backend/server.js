const express = require('express');
const path = require('path');
//Cross-origin resource sharing (CORS) allows AJAX requests to skip the Same-origin policy and access resources from remote hosts. The cors package provides an Express middleware that can that can enable CORS with different options.
const cors = require('cors');

//Mongoose makes interacting with MongoDB through Node.js simpler.
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//dotenv loads environment variables from a .env file into process.env. This makes development simpler. Instead of setting environment variables on our development machine, they can be stored in a file. 
//require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// db url, collection name and db name
if (process.env.NODE_ENV === 'production') {
  const dburl = 'mongodb://efficiency-9696:vdKbn5H9vQei8UJKE5jznyKc23CzUg@db-efficiency-9696.nodechef.com:5387/efficiency';
  mongoose.connect(dburl, { useNewUrlParser: true, useCreateIndex: true }   );
} else {
  const dbname = 'efficiency';
  const dburl = 'mongodb://localhost:27017/'+dbname;
  
  mongoose.connect(dburl, { useNewUrlParser: true, useCreateIndex: true }     ///MongoDB Node.js driver rewrote the tool it uses to parse MongoDB connection strings.
  );
}
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const sellerRouter = require('./routes/seller');
app.use('/api/seller', sellerRouter);

const parentRouter = require('./routes/parent');
app.use('/api/parent', parentRouter);

const childRouter = require('./routes/child');
app.use('/api/child', childRouter);

const parentTypeRouter = require('./routes/parentType');
app.use('/api/parentType', parentTypeRouter);

const childTypeRouter = require('./routes/childType');
app.use('/api/childType', childTypeRouter);

const UserRouter = require('./routes/user');
app.use('/api/user', UserRouter);

const signIn = require('./routes/signIn');
app.use('/api/account', signIn);

// Run static setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './../../frontend/build')));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './../../frontend/build', 'index.html'));
  });
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});