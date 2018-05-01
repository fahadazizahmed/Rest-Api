var StellarSdk = require('stellar-sdk');
var request = require('request');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var pair = StellarSdk.Keypair.random();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

router.post('/sendToken',function(req,res,next){

  var sourceKeys = StellarSdk.Keypair.fromSecret(req.body.sourceKeys);//this is privvate key of owner
  // you can take public key here hard coded

  var issuingKeys = StellarSdk.Keypair.fromSecret(req.body.issuingKeys);//this is the private key of distributor account
  var receivingKeys = req.body.receivingKeys;//this is the investor private key person who receive token

  var mkj = new StellarSdk.Asset('MKJ',sourceKeys.publicKey());//if take public key remove .publicKey()

server.loadAccount(receivingKeys)//get info from of investor public key
 .then(function(account) {

    var trusted = account.balances.some(function(balance) {//loop through investor account
  //  console.log(balance);

    return balance.asset_code === 'MKJ' &&
            balance.asset_issuer === sourceKeys.publicKey();//check if investor contain asseet mkj and receive from owner if yes then send token else you need to generate trust
});
if(trusted===true){
    console.log('trusted')
    server.loadAccount(issuingKeys.publicKey())
    .then(function(issuer) {
        var transaction = new StellarSdk.TransactionBuilder(issuer)
          .addOperation(StellarSdk.Operation.payment({
            destination: receivingKeys,
            asset: mkj,
            amount: req.body.amount
          }))
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .then(function(result) {
        console.log('Success! Results:', result);
        //res.send(JSON.stringify(result));
        res.send({"Result":result});

      })
      .catch(function(error) {
        console.error('Error!', error);
      });
}
else{
    console.log('not trusted')
    res.send({"Error":"Account not trusted"});
}

});

});

module.exports = router;
