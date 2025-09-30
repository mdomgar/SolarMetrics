import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "./Contexts/TokenContext";
import logo from '../assets/logo.png';

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15%;
  background-image: url("https://images.unsplash.com/photo-1648135327756-b606e2eb8caa?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  //background-image: url("https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  color: #004579;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #004579;
  }

  form > div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
    color:rgb(216, 227, 235);
    white;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-radius: 8px;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    background-color: #004579;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
  }

  p {
    text-align: center;
    color: rgb(216, 227, 235);
    margin-top: 1rem;
  }

  a {
    color: rgb(216, 227, 235);
    text-decoration: underline;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useToken();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      setToken(token);
      toast.success("Login successful! Redirecting...", { autoClose: 2000 });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast.error(error.response?.data || "Login failed");
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </FormContainer>
      <ToastContainer />
    </PageWrapper>
  );
};

export default Login;
