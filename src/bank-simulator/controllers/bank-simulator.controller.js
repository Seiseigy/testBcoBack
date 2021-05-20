const recipientModel = require('../models/recipients.model');
const transferModel = require('../models/transfers.model');
/*
Function to get all the recipients in Database
*/
const getRecipients = async(req, res) => {
  console.log('Get recipients request');
  recipientModel.find({}, function (error, docs) {
    if (error) {
      console.log('getRecipient request error');
      res.status(500).send({ status: "error", message: error.message });
    } else {
      console.log('getRecipient request made successfully')
      res.status(200).send({ status: "ok", data: docs });
    }
  });
}
/*
Function to create a new Recipient.
*/
const createRecipient = async(req, res) => {
  console.log('Create recipient request');
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
    console.log('Create recipient request error');
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
        console.log('Create recipient request error');
        res.status(500).send({ status: "error", message: error.message });
      } else {
        console.log('Create recipient request made successfully for recipientId: ', recipient._id);
        res.status(200).send({ status: "ok", data: recipient });
      }
    });
  }
}

/*
Function to create a new transfer. It verifies if the recipient Id 
already exists in Database, if not, it'll send a Status 400 Not found.
*/
const createTransfer = async(req, res) => {
  console.log("Create transfer request");
  const { recipient, amount } = req.body;
  let required = [recipient, amount];
  if (!checkRequired(required)) {
    console.log("Create transfer request error");
    res.status(400).send({ status: "error", message: "Missing params" });
  } else {
    // Verifying if recipient Id exists
    recipientModel.findById( recipient , function (error, docs) {
      if (error) {
        console.log("Create transfer request error");
        res.status(500).send({ status: "error", message: error.message });
      } else {
        if(docs === null) {
          console.log("Create transfer request error");
          res.status(400).send({ status: 'error', message: 'Recipient not found' });
        } else {
          let newTransfer = new transferModel ({
            recipient: recipient,
            amount: amount
          });
          newTransfer.save(function (error, transfer) {
            if (error) {
              console.log("Create transfer request error");
              res.status(500).send({ status: "error", message: error.message });
            } else {
              console.log("Create transfer request made successfully for transfer: ", transfer._id);
              res.status(200).send({ status: "ok", data: transfer });
            }
          });
        }
      }
    });
  }
}

/*
Function to get All transactions in database
*/
const getTransferHistory = async(req, res) => {
  console.log("Transfer history request");
  transferModel.find({}).populate('recipient').exec( function(error, history){
    if (error) {
      console.log("Transfer history request error");
      res.status(500).send({ status: "error", message: error.message });
    } else {
      console.log("Transfer history request made successfully");
      res.status(200).send({ status: "ok", data: history });
    }
  })
}

/*
Simple function for check required params.
*/
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

module.exports = {
  getRecipients,
  createRecipient,
  createTransfer,
  getTransferHistory
}