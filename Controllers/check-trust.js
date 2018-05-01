var StellarSdk = require('stellar-sdk');
var request = require('request');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/checkTrust',function(req,res,next){

  var mkj = 'MKJ';
  var mkjIssuer = req.body.issuer;//this is the owner account public key
  var accountId = req.body.account_id;//this is the investor account public key

  server.loadAccount(accountId)
  .then(function(account) {
    var trusted = account.balances.some(function(balance) {
      console.log(balance);
      return balance.asset_code === mkj && balance.asset_issuer === mkjIssuer;
    });
    if(trusted){
      res.send({"Success":"Trusted"});

    }
    else{
      res.send(JSON.stringify("Not Trusted"));
    }
  });
});
module.exports = router;
