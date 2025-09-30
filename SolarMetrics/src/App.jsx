import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import styled from 'styled-components';
import Login from './components/Login';
import Register from './components/Register';
import Menu from './components/Menu';
import Users from './components/Users';
import Devices from './components/Devices';
import DeviceDetails from './components/DeviceDetails';
import { useRole } from "./components/Contexts/RoleContext";
import Dashboard from "./components/Dashboard";

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

function App() {

  const { role } = useRole();

  return (
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/" element={<Login/>} />
            <Route path="/dashboard" element={role && <AppContainer><Menu/><Dashboard/></AppContainer>} />
            <Route path="/devices" element={role && <AppContainer><Menu/><Devices/></AppContainer>}/>
            <Route path="/admin/users" element={role === "ADMIN" && <AppContainer><Menu></Menu><Users/></AppContainer>}/>
            <Route path="/devices/:deviceId" element={role && <AppContainer><Menu/><DeviceDetails/></AppContainer>}/>
          </Routes>
        </Router>
  );
}

export default App;
