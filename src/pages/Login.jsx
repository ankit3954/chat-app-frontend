import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/logo2.svg"
import { loginRoute } from '../utils/APIRoutes';

function Login() {

  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseonHover: true,
    draggable: true,
    theme: "dark"
  };

  const [values, setValues] = useState({
    username:"",
    password:"",
  });

  useEffect(() => {
    if(localStorage.getItem("chat-app-user")){
      navigate("/")
    }
  }, []);

  const handleSubmit = async(event) => {
    event.preventDefault();

    const {username, password} = values;
    if(handleValidation()){
      const {data} = await axios.post(loginRoute, {
        username,
        password
      });

      if(data.status === false){
        toast.error(data.msg, toastOptions);
      }

      if(data.status === true){
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {

    const {username, password} = values;

    if(password === ""){
      toast.error("username and Password is required.", toastOptions);
      return false;
    }
    else if(username.length === ""){
      toast.error("Username and Password is required.", toastOptions);
      return false;
    }

    return true;

  };

  const handleChange = (e) => {
     setValues({...values, [e.target.name]:e.target.value});
  }


  return (
    <>
      <FormContainer>
        <div className='brand'>
          <img src={Logo} alt=""/>
          <span>Talkr</span>
        </div>
        <form onSubmit={(event) => handleSubmit(event)}>
          <input 
            placeholder='Username' 
            name='username' 
            type="text"
            onChange={(e) => handleChange(e)}  
            min = "3"
          />
  
          <input 
            placeholder='Password' 
            name='password' 
            type="password"
            onChange={(e) => handleChange(e)}  
          />
    
          <button type='submit'>Login</button>
          <span>Don't have an account? <Link to="/register">register</Link></span>
        </form>
          
      </FormContainer>
      <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand{
    display:flex;
    justify-content:center;
    align-items:center;
    gap: 1rem;
    
    img{
      height: 4rem;
    }

    span{
      color: white;
      font-size: 3rem;
      text-transform: uppercase;
    }
  }

  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076; 
    border-radius: 2rem;
    padding: 3rem 5rem;
    @media screen and (min-width: 200px) and (max-width: 720px){
      padding: 2rem 3rem;
      margin: 0 1rem;
    }

    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid  #4e0eff ;  
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      
      &:focus{
        border: 0.1rem solid #997af0;   
        outline: none;
      }
    }

    button{
      background-color:#997af0; 
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover{
        background-color:  #4e0eff; 
      }
    }

    span{
      color: white;
      text-transform: uppercase;

      a{
        color:#4e0eff; 
        font-weight: bold;
        text-decoration: none;
      }
    }
  }
`;

export default Login