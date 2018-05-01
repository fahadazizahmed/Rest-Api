var StellarSdk = require('stellar-sdk');
var request = require('request');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/checkAddr',function(req,res,next){


  var destinationId = req.body.addr;
  console.log("the adress is",destinationId);
  var transaction;


  server.loadAccount(destinationId)
    // If the account is not found, surface a nicer error message for logging.
    .catch(StellarSdk.NotFoundError, function (error) {
      res.send("account does not exist");
    })
    // If there was no error, load up-to-date information on your account.
    .then(function() {
      res.send("valid");
    })


});

module.exports = router;
