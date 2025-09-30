import { Link } from "react-router-dom";
import styled from 'styled-components';
import {ChartBarIcon, DevicePhoneMobileIcon, UsersIcon, ArrowLeftStartOnRectangleIcon} from "@heroicons/react/24/outline";
import logo from '../assets/logo.png';
import { useRole } from "./Contexts/RoleContext";

const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 260px;
  height: 100vh;
  background-color: #1e2a38;
  color: white;
  padding: 20px 10px;
  box-sizing: border-box;
  position: relative;
`;


const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
`;

const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
`;


const NavTitle = styled.div`
  display: flex;
  color: #7d8b9a;
  font-size: 12px;
  margin: 10px 10px 5px;
  justify-content: flex-start
  
`;

const NavList = styled.ul`
  border: 1px solid #29384a;
  background-color: #29384a;
  list-style: none;
  padding: 0;
  margin: 0 5px 20px 0;
  border-radius: 8px;
  flex-grow: 1;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
  color: #c2cbd3;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background-color: #293544;
    color: #fff;
  }

  svg {
    margin-right: 10px;
  }
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;

const FinalItem = styled.div`
  margin-top: auto;
  padding: 10px;
  color: #c2cbd3;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s ease;
  border-radius: 6px;

  &:hover {
    background-color: #293544;
    color: #fff;
  }
`;

const Menu = () => {
  const { role } = useRole();
  
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");

    Navigate("/login");
  }
  return (
    <SidebarContainer>
      <LogoContainer>
      <LogoImage src={logo} alt="Logo" />
      SolarMetrics
      </LogoContainer>
      <nav>
        <NavList>
        <NavTitle>Home</NavTitle>
        <StyledLink to="/dashboard"><NavItem><Icon><ChartBarIcon/></Icon>Dashboards</NavItem></StyledLink>
        <StyledLink to="/devices"><NavItem><Icon><DevicePhoneMobileIcon/></Icon>Devices</NavItem></StyledLink>
        </NavList>

        {role === "ADMIN" && (<NavList>
          <NavTitle>Administration</NavTitle>
          <StyledLink to="/admin/users"><NavItem><Icon><UsersIcon/></Icon>User Accounts</NavItem></StyledLink>
        </NavList>) }
        </nav>
        <FinalItem>
        <Icon><ArrowLeftStartOnRectangleIcon/></Icon>
          <StyledLink onClick={handleLogout} to="/login">Sign Out</StyledLink>
        </FinalItem>
    </SidebarContainer>
  );
};

export default Menu;
