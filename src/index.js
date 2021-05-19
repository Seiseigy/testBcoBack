const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const { PORT, MONGODB_URL } = process.env;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log(PORT);
console.log(MONGODB_URL);

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

var recipientModel = require("../models/recipients.model");
var transferModel = require("../models/transfers.model");
const { request } = require("express");

// COMMENT HERE
app.post("/createRecipient", function (req, res) {
  const {
    name,
    rut,
    email,
    phoneNumber,
    destinyBank,
    accountType,
    accountNumber,
  } = req.body;
  let required = [
    name,
    rut,
    email,
    phoneNumber,
    destinyBank,
    accountType,
    accountNumber,
  ];
  if (!checkRequired(required)) {
    res.status(400).send({ status: "error", message: "Missing params" });
  } else {
    let newRecipient = new recipientModel({
      name: name,
      rut: rut,
      email: email,
      phoneNumber: phoneNumber,
      destinyBank: destinyBank,
      accountType: accountType,
      accountNumber: accountNumber,
    });
    newRecipient.save(function (error, recipient) {
      if (error) {
        res.status(500).send({ status: "error", message: error.message });
      } else {
        res.status(200).send({ status: "ok", data: recipient });
      }
    });
  }
});

// COMMENT HERE
app.get("/getRecipients", function (req, res) {
  recipientModel.find({}, function (error, docs) {
    if (error) {
      res.status(500).send({ status: "error", message: error.message });
    } else {
      res.status(200).send({ status: "ok", data: docs });
    }
  });
});

// COMMENT HERE
app.post("/createTransfer", function (req, res) {
  const { recipient, amount } = req.body;
  let required = [recipient, amount];
  if (!checkRequired(required)) {
    res.status(400).send({ status: "error", message: "Missing params" });
  } else {
    // Verifying if recipient Id exists
    recipientModel.findById( recipient , function (error, docs) {
      if (error) {
        res.status(500).send({ status: "error", message: error.message });
      } else {
        if(docs === null) {
          res.status(400).send({ status: 'error', message: 'Recipient not found' });
        } else {
          let newTransfer = new transferModel ({
            recipient: recipient,
            amount: amount
          });
          newTransfer.save(function (error, transfer) {
            if (error) {
              res.status(500).send({ status: "error", message: error.message });
            } else {
              res.status(200).send({ status: "ok", data: transfer });
            }
          });
        }
      }
    });
  }
});

// COMMENT HERE
app.get("/getTransferHistory", function (req, res) {
  transferModel.find({}).populate('recipient').exec( function(error, history){
    if (error) {
      res.status(500).send({ status: "error", message: error.message });
    } else {
      res.status(200).send({ status: "ok", data: history });
    }
  })
});

const checkRequired = (requiredList) => {
  let pass = true;
  requiredList.forEach((element) => {
    if (!element) {
      pass = false;
      return pass;
    }
  });
  return pass;
};
