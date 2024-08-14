const mongoose=require('mongoose');

const dotenv=require('dotenv');
const path=require('path');

dotenv.config({path:path.join(__dirname,'config','config.env')});

const db=()=>{
    mongoose.connect(process.env.DB_URL)
    .then((con)=>{
        console.log('MongoDB is connected to the host',con.connection.host)
    })
    .catch((err)=>{
        console.log('Failed to connect database',err)
    })
}
module.exports=db;