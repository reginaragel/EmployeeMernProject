import React,{useState,useContext} from "react";
import './LoginPage.css';
import {Link,Navigate} from 'react-router-dom';
import { UserContext } from "./UserContext";


const LoginPage=()=>{

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);
    const {setUserInfo}=useContext(UserContext);
    const {setToken}=useContext(UserContext);

    const handleLogin=async(e)=>{
        e.preventDefault();

        if(!email || !password){
            alert('Please provide user credentials')
        }
        try{
            const response=await fetch('http://localhost:5000/login',{
                method:'POST',
                body:JSON.stringify({email,password}),
                headers:{'Content-Type':'application/json'},
                credentials:'include',

            })
            if(!response.ok){
                throw new Error('Network response was not ok')
            }else if(response.ok){
                response.json()
                .then(userInfo=>{
                    setUserInfo(userInfo);
                    setToken(userInfo.token);
                    setRedirect(true)
                })
            }
            console.log('Login Successful')
        }catch(err){
            console.error('Error while Logging In',err);
            alert('Login Failed')
        }
    }
    if(redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <form onSubmit={handleLogin}>
            {/* <h1>Login Page</h1> */}
            <div className="container">
                <h3>Login</h3>
                <input type="email" placeholder="Email"
                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password"
                value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn" type="submit">Login</button>
                <span>Don't have an account?<Link to={'/signup'} >SignUp</Link></span>

            </div>

        </form>
    )
}
export default LoginPage