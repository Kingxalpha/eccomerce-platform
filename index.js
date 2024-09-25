require("dotenv").config();
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require("./config/connect");
const PORT = process.env.PORT;
const app = express();
const cors = require('cors')
const authRouter = require("./routes/auth")
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require("./routes/users");
const productRouter = require("./routes/product");
const searchRouter = require("./routes/search");
const cartRouter = require("./routes/cart");
const supportRouter = require("./routes/support");


// ... other middlewares and routes
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/search", searchRouter)
app.use("/api/cart", cartRouter)
app.use("/api/support", supportRouter)


// Handling Cors Options
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// CORS OPTION
app.use(cors(corsOptions));
app.use(errorHandler);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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