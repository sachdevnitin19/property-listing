var mongoose=require('mongoose');
var propertySchema=new mongoose.Schema({
    id:String,
    title:String,
    owner:String,
    price:Number,
    address:String,
    city:String,
    country:String,
    created:Date
},
{
    timestamps:false
});
var property=mongoose.model("Property",propertySchema,"properties")
module.exports=property;