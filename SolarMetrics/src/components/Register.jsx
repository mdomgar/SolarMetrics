import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import { useToken } from './Contexts/TokenContext';

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb"); /* naturaleza */
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  color: white;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  form > div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
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
    background-color: #4a90e2;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
  }

  p {
    text-align: center;
    margin-top: 1rem;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Send registration request
      await axios.post('http://localhost:8080/auth/register', { username, password });

      // Log the user in immediately after registration
      const response = await axios.post('http://localhost:8080/auth/login', { username, password });
      const token = response.data.token;

      setToken(token);

      toast.success("Register successful! Redirecting...", { autoClose: 2000 });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data || "Error during registration or login");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </FormContainer>
      <ToastContainer/>
    </PageWrapper>
  );
};

export default Register;