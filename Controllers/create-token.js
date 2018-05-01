var StellarSdk = require('stellar-sdk');
var request = require('request');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/createToken',function(req,res,next){

   var issuingSecret = req.body.issuingkey;//this is the owner private key
   var distributingSecret = req.body.distributingkey;//this is the distributor  privte key
   var totolSupply = req.body.supply;

   // Keys for accounts to issue and receive the new asset
   var issuingKeys = StellarSdk.Keypair.fromSecret(issuingSecret);
   console.log("issuing secret",issuingSecret);
   var receivingKeys = StellarSdk.Keypair.fromSecret(distributingSecret);
   console.log("distributor secret",receivingKeys);

   // Create an object to represent the new asset
   var mkj = new StellarSdk.Asset('MKJ', issuingKeys.publicKey());
   console.log("owner public",issuingKeys.publicKey())

   // First, the receiving account must trust the asset
   server.loadAccount(receivingKeys.publicKey())
     .then(function(receiver) {
       console.log("distributo public key",receivingKeys.publicKey())
       var transaction = new StellarSdk.TransactionBuilder(receiver)
         .addOperation(StellarSdk.Operation.changeTrust({
           asset: mkj,
         }))
         .build();
       transaction.sign(receivingKeys);
       return server.submitTransaction(transaction);
     })

     // Second, the issuing account actually sends a payment using the asset
     .then(function() {
       return server.loadAccount(issuingKeys.publicKey())
     })
     .then(function(issuer) {
       var transaction = new StellarSdk.TransactionBuilder(issuer)
         .addOperation(StellarSdk.Operation.payment({
           destination: receivingKeys.publicKey(),
           asset: mkj,
           amount: totolSupply
         }))
         .build();
       transaction.sign(issuingKeys);
       return server.submitTransaction(transaction);
     })
     .then(function(result) {
       console.log('Success! Results:', result);

       res.send({"Result":result});
     })
     .catch(function(error) {
       console.error('Error!', error);
       res.send({"Error":"Try again please"});

     });

});

module.exports = router;
