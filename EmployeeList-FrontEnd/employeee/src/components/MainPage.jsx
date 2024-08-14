import React from "react";
import './MainPage.css';
import { assets } from "./assets/image";
import { useState ,useContext,useEffect} from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


const MainPage = () => {

    const [isFormVisible,setIsFormVisible]=useState(false);
    const [tableVisible,setTableVisible]=useState(false)
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [mobileno,setMobileNo]=useState('');
    const [desgination,setDesignation]=useState('');
    const [gender,setGender]=useState('');
    const [course,setCourse]=useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [employees,setEmployees]=useState([])
    const { token } = useContext(UserContext);
    const [isEditing,setIsEditing]=useState(false);
    const [editingForm,setEditingForm]=useState(null)

    const handleCreateEmp=()=>{
        setIsFormVisible(true);
        setTableVisible(false)
    }
    
    const handleTable=()=>{
        setIsFormVisible(false)
        setTableVisible(true)
    }
    
    const handleFormData=async(e)=>{
        const data=new FormData();
        data.set('name',name);
        data.set('email',email);
        data.set('mobileno',mobileno);
        data.set('designation',desgination);
        data.set('gender',gender);
        data.set('course',course);
        data.set('files',files[0]);
        e.preventDefault();
        console.log(files);

        const response=await fetch('http://localhost:5000/formpost',{
            method:'POST',
            body:data,
            credentials:'include',
    
    
        })
       if (response.ok){
        setIsFormVisible(false);
        setTableVisible(true);
        fetchTasks();
     
        //  setRedirect(true);
       }
    
       }

       const handleCourseChange = (event) => {
        const value = event.target.value;
        setCourse((prevCourses) =>
          prevCourses.includes(value)
            ? prevCourses.filter((course) => course !== value) 
            : [...prevCourses, value] 
        );
      };
      const fetchTasks=async()=>{
        const response=await fetch('http://localhost:5000/employee',{
            method:'GET',
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials:'include',
        })
        
        if(response.ok){
            const data=await response.json()
            console.log(data)
            setEmployees(data)
            // console.log(data);
            console.log(fetchTasks);
        }else{
            console.error('Failed to fetch tasks',await response.json())
        }
        console.log(employees)
    }
    useEffect(()=>{
        if (token) {
            fetchTasks();
        }
    },[token]);
    const handleLogout = () => {
        fetch('http://localhost:5000/logout', {
            credentials: 'include',
            method: 'POST',
            })
            .then(() => setUserInfo(null))
            .catch(error => {
                console.error('Error logging out', error);
            });
            setRedirect(true)
    };

    const handleEdit=async(e)=>{
        e.preventDefault();
        if(!token){
            alert('You are not authenticated');
            return
        }
        const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('mobileno', mobileno);
            data.append('designation', desgination);
            data.append('gender', gender);
            data.append('course', course);
            if (files) {
                data.append('files', files[0]);
            }
        try{
            const response=await fetch(`http://localhost:5000/employee/${editingForm}`,{
                method:'PUT',
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                body:data,
                credentials:'include',
            });
            if(response.ok){
                const updatedForm=await response.json();
                setEmployees(employees.map(employee=>employee._id===editingForm?updatedForm:employee))
                alert('Employee Details Updated')
                resetForm();
                fetchTasks();
            }else{
                console.error('Failed to update details',await response.json())
            }
        }catch(err){
            console.error('Error while updating employee details',err)
        }

    }
    const startEditing=(employee)=>{
        setName(employee.name);
        setEmail(employee.email);
        setMobileNo(employee.mobileno);
        setDesignation(employee.desgination);
        setGender(employee.gender);
        setCourse(employee.course);
        setFiles(employee.files);
        setEditingForm(employee._id);
        setIsEditing(true);
        setIsFormVisible(true);
    }
    const resetForm=()=>{
        setName('');
        setEmail('');
        setMobileNo('');
        setDesignation('');
        setGender('');
        setCourse([]);
        setFiles(null);
        setIsEditing(false);
        setEditingForm(null);
        setIsFormVisible(false)
    }

    const handleDelete=async(id)=>{
        if(!token){
            alert('You are not authenticated');
            return
        }
        try{
            const response=await fetch(`http://localhost:5000/employee/${id}`,{
                method:'DELETE',
                headers:{
                    Authorization:`Bearer ${token}`
                },
                credentials:'include',
            });
            if(response.ok){
                setEmployees(employees.filter(employee=>employee._id !==id));
                alert('Employee deleted Successfully')
            }else{
                console.error('Failed to delete employee',await response.json())
            }
        }catch(error){
            console.error('Error while deleting employee',error)
        }

    }
       if(redirect){
        return <Navigate to={'/login'}/>
       }
 




return (
        <div className="total">
            <div className="main">
                <a className="logo" href="#"><img src={assets.user_icon} alt="User Icon" /></a>
                <span>{userInfo ? userInfo.userName : ''}</span>
                <ul className="navbar">
                    <li><a href="#home">HOME</a></li>
                    <li><a href="#employee-list" onClick={handleTable}>EMPLOYEE LIST</a></li>
                    <li><a href="#create" onClick={handleCreateEmp}>CREATE EMPLOYEE</a></li>
                </ul>
                <div className="header-btn">
                    <a href="#" className="logout" onClick={handleLogout}>Logout</a>
                </div>
            </div>
            <div className="second">
                <div className="heading">
                    <h2>Welcome to Admin Portal</h2>
                </div>
                {isFormVisible && (<div className="list">
                <form onSubmit={isEditing ? handleEdit : handleFormData} encType="multipart/form-data">
                    <div className="formdata">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Mobile No</label>
                    <input type="text" value={mobileno} onChange={(e)=>setMobileNo(e.target.value)}/>
                    <label>Designation</label>
                    <select value={desgination} onChange={(e)=>setDesignation(e.target.value)}>
                        <option>HR</option>
                        <option>Manager</option>
                        <option>Sales</option>
                    </select>
                    <label>Gender</label>
                    <div className="flex-container" >
                    <input type="radio" name="gender" id="Male" value="Male" checked={gender==='Male'} onChange={(e)=>setGender(e.target.value)}/>
                    <label htmlFor="Male">Male</label>
                    <input type="radio" name="gender" id="Female" value="Female" checked={gender==='Female'} onChange={(e)=>setGender(e.target.value)} />
                    <label htmlFor="Female">Female</label>
                    </div>
                    
                    
                    <label>Course</label>
                    <div className="flex-container">
                    <input type="checkbox" name="MCA" id="mca" value="MCA" checked={course.includes('MCA')} onChange={handleCourseChange}/>
                    <label htmlFor="MCA">MCA</label>
                    <input type="checkbox" name="BCA" id="bca" value="BCA" checked={course.includes('BCA')} onChange={handleCourseChange}/>
                    <label htmlFor="BCA">BCA</label>
                    <input type="checkbox" name="BSC" id="bsc" value="BSC" checked={course.includes('BSC')} onChange={handleCourseChange}/>
                    <label htmlFor="BSC">BSC</label>

                    </div>
                    
                    <label>Img Upload</label>
                    <input type="file" name="files" onChange={(e)=>setFiles(e.target.files)}/>
                    <button type="submit">{isEditing?'Update':'Submit'}</button>

                    </div>
                    

                </form>
                {/* <div>
                
                </div> */}


                </div>
            )}
            </div>
            {tableVisible &&(<div className="tablebox">
            <table>
                    <tr>
                        <thead>
                            <th>Unique Id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile No</th>
                            <th>Designation</th>
                            <th>Gender</th>
                            <th>Course</th>
                            <th>Create Date</th>
                            <th>Action</th>

                        </thead>
                        <tbody>
                            {employees.length>0?(
                                employees.map((employee,index)=>(
                                    <tr key={index}>
                                        <td>{employee.id}</td>
                                        <td><img src={`http://localhost:5000/${employee.image}`} alt="employee" width="50"/></td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.mobileno}</td>
                                        <td>{employee.designation}</td>
                                        <td>{employee.gender}</td>
                                        <td>{Array.isArray(employee.course) 
                                              ? employee.course.join(', ') 
                                              : employee.course}</td>
                                        <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <a href="#" onClick={()=>startEditing(employee)}>Edit</a>,
                                            <a href="#" onClick={()=>handleDelete(employee._id)}>Delete</a>
                                        </td>

                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td>No data available</td>
                                </tr>
                            )}
                            

                        </tbody>
                        
                        
                    </tr>
                </table>

            </div>)}
        </div>
    );
}


export default MainPage;
