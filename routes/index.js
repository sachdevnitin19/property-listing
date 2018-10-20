var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var fs = require('fs');
var Property = require('../models/property.model');
/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// Dumps data directly into db.
router.post('/property', upload.single('propertyFile'), function (req, res) {
  let propertyList = {};
  let promiseArr = [];
  if(!req.file) res.status(400).json({Status:"error",message:"JSON file with property data is required."});
  if (req.file.mimetype != 'application/json') res.status(400).json({ status: "Error", message: "Only json files are allowed" });
  fs.readFile(`./uploads/${req.file.filename}`, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      res.status(400).status({ status: "Error", message: "Invalid json file" });
    } else {
      try {

        propertyList = JSON.parse(data);
        propertyList.data.forEach(propertyData => {
          promiseArr.push(new Property(propertyData).save());
        });

        Promise.all(promiseArr).then(function (results) {
          res.json({ Status: "Success" });
        })
          .catch(function (err) {
            console.error(err);
            res.status(500).json({ status: "Error", message: "some error occured while inserting data in db" });
          });
      } catch (jsonErr) {
        console.error(jsonErr);
        res.status(400).json({ status: "Error", message: "Invalid json file" });
      }
    }
  });
})

router.get('/property', function (req, res) {
  if (!req.query.id){
    res.status(400).json({ Status: "error", message: "'id' field is required in query params." });
  } else{
    Property.findOne({ id: req.query.id }).exec().then(function (property) {
      if (!property) {
        res.status(404).json({ Status: "success", message: 'Data not found.' });
      }else{
        res.json({ Status: "success", property: property });
      }
    }).catch(function (err) {
      console.error(err);
      res.status(500).json({ Status: "error", message: "Internal Server Error" });
    });
  }
});

router.post('/propertylist',function(req,res){
  let sortparams={};

  if(req.body.limit==null || typeof req.body.limit!='number' ||  req.body.offset==null || typeof req.body.offset!='number'){
    console.log("limit or offset not found");
    res.status(400).json({Status:"error",mesage:" 'limit' & 'offset' are required fields and they must be numeric."});
  }else{
    if(req.body.price) sortparams.price=req.body.price;
    if(req.body.date) sortparams.date=req.body.date;
    Property.find().skip(req.body.offset).limit(req.body.limit).sort(sortparams).exec().then(function(propertyList){
      res.json({Status:'success',propertyList:propertyList});
    }).catch(function(err){
      console.log(err);
      res.status(500).json({Status:"error",message:"Some error occurred"});
    })
  }
})

router.get('/searchproperty',function(req,res){
  console.log(req.query.searchparam);
  if(!req.query.searchparam) req.status(400).json({Status:"error",message:"searchparam is required field."});
  Property.find({$text:{$search:req.query.searchparam}}).exec().then(function(results){
    res.json({Status:"success",propertylist:results});
  }).catch(function(err){
    console.error(err);
    res.status(500).json({Status:"error",message:"some error occured"});
  })
})
module.exports = router;
