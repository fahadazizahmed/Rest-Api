var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sendTokenController = require('./Controllers/send-token');
var createAccountController = require('./Controllers/create-account');
var getBalanceController = require('./Controllers/get-balance');
var sendTransactionController = require('./Controllers/send-transaction');
var createTokenController = require('./Controllers/create-token');
var checkTrustController = require('./Controllers/check-trust');
var makeTrustController = require('./Controllers/make-trust');
var accountDetailController = require('./Controllers/account-detail');
var checkFile = require('./Controllers/checkFile');
//var ethreumApiController = require('./Controllers/ethreumApi');




app.use(bodyParser.json());
app.use('/api',sendTokenController);
app.use('/api',createAccountController);
app.use('/api',getBalanceController);
app.use('/api',sendTransactionController);
app.use('/api',createTokenController);
app.use('/api',checkTrustController);
app.use('/api',makeTrustController);
app.use('/api',checkFile);

//app.use('/api',ethreumApiController);
app.use(function(err,req,res,next){
  console.log(err.message)
  res.status(404).send({Error:err.message});
});






app.listen(5500);//if you domiin have live server then 4000 not used we used port.env.fe
console.log('Server running on port 8000');
