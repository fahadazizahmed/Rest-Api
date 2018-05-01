var StellarSdk = require('stellar-sdk');
var request = require('request');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/getBalance',function(req,res,next){

   var balanceList = [];

   server.loadAccount(req.body.publicKey).then(function(account) {
     console.log('Balances for account: ' + req.body.publicKey);

     account.balances.forEach(function(balance) {
         console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
         var singleBalance = {};
         singleBalance['currency'] = balance.asset_type;
         singleBalance['Balance'] = balance.balance;
         balanceList.push(singleBalance);
     });
     res.contentType('application/json');
     res.end(JSON.stringify(balanceList));
 });




















});



module.exports = router;
