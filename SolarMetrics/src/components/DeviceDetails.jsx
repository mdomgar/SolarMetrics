import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Graphic from "./Graphic";
import Loading from "./Loading";
import UserTag from "./UserTag";

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: white;
`;

const HeaderBox = styled.div`
  background: linear-gradient(90deg, #1e2a38, #2c3e50);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 12px 12px;
`;

const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 28px;
`;

const Text = styled.p`
  color: black;
  padding-left: 16px;
`;

const DeviceDetails = () => {

    const location = useLocation();
    const { stationLabel, deviceId } = location.state || {};

    return (
    <Container>
      <HeaderBox>
        <Title>{stationLabel}</Title>
        <UserTag/>
      </HeaderBox>
      <Loading>
      <Graphic deviceId={deviceId}/>
      </Loading>
    </Container>
    )
}

export default DeviceDetails;