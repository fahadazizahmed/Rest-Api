var StellarSdk = require('stellar-sdk');
var request = require('request');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/makeTrust',function(req,res,next){

  var sourceKey = 'GAI4LEFBCPRRIHEHYZDMLWQ6YSB7PWDSBBOAEIXAMJQQWUVGLX2ARLFO'; //this is owner public key
  // account which is making trust with the token
  var investorkey = req.body.investorkey;//this is investor private key
  console.log("key is here",investorkey)
  var receivingKeys = StellarSdk.Keypair.fromSecret(investorkey);
  var mkj = new StellarSdk.Asset('MKJ', sourceKey);

  // change trust and submit transaction
  server.loadAccount(receivingKeys.publicKey())
    .then(function(receiver) {
      var transaction = new StellarSdk.TransactionBuilder(receiver)
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: mkj,
          //limit: '1000'
        }))
        .build();
      transaction.sign(receivingKeys);
      return server.submitTransaction(transaction);
    })
    .then(function(result) {
      console.log('Success! Results:', result);

      res.send({"Success":"Trust Generated"});
    })
    .catch(function(error) {
      console.error('Error!', error);

     res.send({"Error":"Trust Not Generated"});
    });

});

module.exports = router;
