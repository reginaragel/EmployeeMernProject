const express=require('express');
const dotenv=require('dotenv');
const path=require('path');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken')
const db=require('./config/config');
const multer=require('multer');
const uploadMiddleware=multer({dest:'uploads/'});
const fs=require('fs')
const Employee=require('./models/Employee');
const Detail=require('./models/EmployeeDetails')
const brcypt=require('bcrypt');
const app=express();

dotenv.config({path:path.join(__dirname,'config','config.env')});

const salt=brcypt.genSaltSync(10);
const secret='ragel2352f245';
const options={
    expiresIn:'1h'
}

app.use(cors({credentials:true,origin:'http://localhost:3001'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))
db();

function extractUsername(req, res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.log(user.id)
        req.user= user; 
        next();
    });
}

app.post('/signup',async(req,res)=>{

    const {userName,email,password}=req.body;

    try{
        const user=new Employee({
            userName,
            email,
            password:brcypt.hashSync(password,salt),
        });
        await user.save();
        res.status(201).json({messagge:'User registered Successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Failed to register user'})
    }
    
});


app.post('/login',async(req,res)=>{

    const {email,password}=req.body;

    
    const user=await Employee.findOne({email});
    console.log(user)
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk=brcypt.compareSync(password,user.password);
    if(passOk){
        const payload = {
            id:user._id
        }
        const token = jwt.sign(payload, secret, options);

            res.cookie('token',token).json({
                id:user._id,
                email:user.email,
                userName:user.userName,
                token:token,
            });
    }else{
        res.status(400).json('Wrong credentials')
    }
   
});

app.post('/formpost',uploadMiddleware.single('files'),async(req,res)=>{
    console.log('File:', req.file);
    console.log('Body:', req.body);
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const {originalname,path:tempPath}=req.file;
    console.log('file',req.file)
    const parts=originalname.split('.');
    const ext=parts[parts.length-1];
    const newPath=tempPath+'.'+ext;
    fs.renameSync(tempPath,newPath);
     
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const {name,email,mobileno,desgination,gender,course}=req.body;
        console.log(req.body)
        const postDoc=await Detail.create({
            name,
            email,
            mobileno,
            desgination,
            gender,
            course,
            image:newPath,
            userId:info.id,
        })
        res.json(postDoc);
        
        
    });
    

    
    // res.json('posting content')
});

app.get('/employee',extractUsername,async(req,res)=>{
    const user_id=req.user.id;
    console.log(user_id);
    try{
        const employees=await Detail.find({})
        res.json(employees);
        console.log('Data not fetched')
    }catch(err){
        res.status(500).json({message:'Error Fetching tasks',err})
    }
})
app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.put('/employee/:id',uploadMiddleware.single('files'),async (req,res)=>{
    let newPath=null;
    if(req.file){
        const {originalname,path:tempPath}=req.file;
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
        newPath=tempPath+'.'+ext;
        fs.renameSync(tempPath,newPath);
    }

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err){
            return res.status(403).json({error:'Invalid token'})
        }
        const {id}=req.params;
        const {  name, email, mobileno,desgination,gender,course } = req.body;

        // const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
        try{
            const updatedDoc=await Detail.findByIdAndUpdate(
                id,
                {
                    name,
                    email,
                    mobileno,
                    desgination,
                    gender,
                    course,
                    image:newPath || undefined,
                },
                {new:true}
            );
            if(!updatedDoc){
                return res.status(404).json({error:'Employee not found'})
            }
            res.json(updatedDoc)
        }
        catch(error){
            console.error('Error updating employee', error);
            res.status(500).json({ message: 'Error updating employee', error });
        }
        
        
    });
    

})

app.delete('/employee/:id',extractUsername,async(req,res)=>{
    const {id}=req.params;
    const {token}=req.cookies

    jwt.verify(token,secret,{},async(err,info)=>{
        if(err){
            return res.status(403).json({error:'Invalid  token'});
        }
        try{
            const deletedDoc=await Detail.findByIdAndDelete(id);
            if(!deletedDoc){
                return res.status(404).json({error:'Employee not found'});
            }
            // if(deletedDoc.image){
            //     fs.unlinkSync(path.join(__dirname,'uploads',deletedDoc.image));
            // }
            res.json({message:'Employee deleted Successfully'})
        }catch(error){
            console.error('Error deleting employee', error);
            res.status(500).json({ message: 'Error deleting employee', error });
        }
    })
})


app.listen(process.env.PORT,()=>{
    console.log(`Server Listening on port ${process.env.PORT}`);
    
})