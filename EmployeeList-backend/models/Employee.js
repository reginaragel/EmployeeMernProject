const mongoose=require('mongoose');
const {Schema,model}=mongoose;


const EmployeeSchema=new Schema({

    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})

const EmployeeModel=model('Employee',EmployeeSchema);

module.exports=EmployeeModel;