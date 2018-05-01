var StellarSdk = require('stellar-sdk');
var request = require('request');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.get('/createAccount',function(req,res,next){

     pair.secret();
     console.log("secret key",pair.secret());
     pair.publicKey();
     console.log("public key",pair.publicKey());

     request.get({
       url: 'https://friendbot.stellar.org',
       qs: { addr: pair.publicKey() },
       json: true
     }, function(error, response, body) {
       if (error || response.statusCode !== 200) {
         console.error('ERROR!', error || body);
       }
       else {
         console.log('SUCCESS! You have a new account :)\n', body);
        res.send({"private key": pair.secret(), "public key":pair.publicKey(), "result":body})
       }
     });
});

module.exports = router;
