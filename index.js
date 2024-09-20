require("dotenv").config();
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require("./config/connect");
const PORT = process.env.PORT;
const app = express();
const cors = require('cors')

const path = require('path');






// ... other middlewares and routes
app.use(cors());

// Handling Cors Options
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// CORS OPTION
app.use(cors(corsOptions));
app.use(errorHandler);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


const start = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON ${PORT}...`);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  start();