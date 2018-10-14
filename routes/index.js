var express = require('express');
var router = express.Router();
var multer=require('multer');
var upload=multer({dest:'./uploads/'});
var fs=require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/property',upload.single('propertyFile'),function(req,res,next){
  console.log(req.file);
  var propertyData={};
  if(req.file.mimetype!='application/json') res.status(400).json({status:"Error",message:"Only json files are allowed"});
  fs.readFile(`./uploads/${req.file.filename}`,'utf8',function(err,data){
    if(err){
      console.error(err);
      res.status(400).status({status:"Error",message:"Invalid json file"});
    }else{
      try{
        
        propertyData=JSON.parse(data);
        console.log(`data length ${propertyData.data.length}`);
        console.log("Data read successfully.");
        res.json({Status:"Success"});
      }catch(jsonErr){
        console.error(jsonErr);
        res.status(400).json({status:"Error",message:"Invalid json file"});
      }
    }

  });
})

module.exports = router;
