const mongoose=require('mongoose');
const {Schema,model}=mongoose;

const DetailsSchema=new Schema({
    name:String,
    email:String,
    mobileno:String,
    desgination:String,
    gender:String,
    course:String,
    image:String,
},{
    timestamps:true,
})

const DetailsModel=model('Detail',DetailsSchema);

module.exports=DetailsModel;