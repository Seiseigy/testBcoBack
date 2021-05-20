const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bankSimulatorRoutes = require('./bank-simulator/routes/bank-simulator.routes');

// Environment variables
dotenv.config();
const { PORT, MONGODB_URL } = process.env;


app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    next();
});


try {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Successfully connect to database");
} catch (error) {
  console.log("Error when connecting to database: ", error.message);
}

// Router
app.use('', bankSimulatorRoutes);
