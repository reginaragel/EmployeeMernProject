import React ,{useState}from "react";
import './SignupPage.css';
import {Link} from 'react-router-dom';
const SignupPage=()=>{

    const [userName,setUserName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleSignup=async(e)=>{
        e.preventDefault();
        if(!userName || !email || !password){
            alert('Please Provide User Details to Signup')
        }
        try{
            const response=await fetch('http://localhost:5000/signup',{
                method:'POST',
                body:JSON.stringify({userName,email,password}),
                headers:{'Content-Type':'application/json'},
            });
            if(response.ok){
                alert('User Registered Successfully!!!!')
            }else{
                throw new Error('Network response was not ok')
            }
        }catch(err){
            console.error('Error While Signing Up',err);
            alert('Registration Failed');
        }
    }
    return(
        <form onSubmit={handleSignup}>
            {/* <h1>SignUp Page</h1> */}
            <div className="signup-container">
                <h3>SignUp</h3>
                <input type="text" placeholder="Username" id="user"
                value={userName} onChange={(e)=>setUserName(e.target.value)}/>
                <input type="email" placeholder="Email" id="email"
                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" id="pass"
                value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btnn" type="submit">Signup</button>
                <span>Already have an account?<Link to={'/login'} >Login</Link></span>

            </div>

        </form>
    )
}
export default SignupPage