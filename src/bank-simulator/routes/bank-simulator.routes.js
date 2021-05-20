const express = require('express');
const router = express.Router();
const bankSimulatorController = require('../controllers/bank-simulator.controller');

router.get('/getRecipients', bankSimulatorController.getRecipients);
router.get('/getTransferHistory', bankSimulatorController.getTransferHistory);
router.post('/createRecipient', bankSimulatorController.createRecipient);
router.post('/createTransfer', bankSimulatorController.createTransfer);


module.exports = router;
