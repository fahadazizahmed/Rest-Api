var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.get('/check',function(req,res,next){
  res.send("ffgg");


});
module.exports = router;
