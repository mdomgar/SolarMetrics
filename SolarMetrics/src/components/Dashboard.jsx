import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InfluxDB } from '@influxdata/influxdb-client';
import InverterCard from './InverterCard';
import { useRole } from './Contexts/RoleContext';
import { useToken } from './Contexts/TokenContext';
import MultiLineChartPage from './MultiLineGraphic';
import Loading from './Loading';
import UserTag from './UserTag';

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
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
  color: #ffffff;
  font-size: 28px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 2rem 2rem;
`;

const Message = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #333;
`;

const Dashboard = () => {
  const [inverters, setInverters] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const { currentUser } = useRole();
  const { token } = useToken();
  const ip = import.meta.env.VITE_SERVICES_IP;

  useEffect(() => {
    const fetchUserInverters = async () => {
      try {
        const res = await fetch(`http://localhost:8080/devices?username=${currentUser}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        setInverters(data);
      } catch (err) {
        console.error(err.response?.data || 'Error fetching devices:', err);
      }
    };
    fetchUserInverters();
  }, [currentUser]);

  useEffect(() => {
    const url = `http://${ip}:8086`;
    const influxToken = 'psO1oImBZWlAxJqMTwqtsdRMHHVaAajVWbD-MIPrDqFktIwA5iVlJgsJ6pjf9iJ2bCRUSxL44HCt4xSlsjstOw==';
    const org = 'mdomgar';
    const bucket = 'SolarData';

    const client = new InfluxDB({ url, token: influxToken });
    const queryClient = client.getQueryApi(org);

    const fetchDataForInverter = (inverter) => {
      return new Promise((resolve, reject) => {
        const fluxQuery = `
          from(bucket: "${bucket}")
            |> range(start: -1h)
            |> filter(fn: (r) => r["deviceId"] == "${inverter.deviceId}")
            |> filter(fn: (r) => r["_field"] == "activePower" or r["_field"] == "dayPower" or r["_field"] == "totalPower" or r["_field"] == "mpptPower" or r["_field"] == "pv1_u" or r["_field"] == "pv1_i")
            |> mean()
        `;

        const values = {
          ...inverter,
          activePower: 0,
          todayEnergy: 0,
          totalVoltage: 0,
          totalCurrent: 0,
          mpptPower: 0,
          pv1Voltage: 0
        };

        queryClient.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            switch (o._field) {
              case 'activePower': values.activePower = Number(o._value.toFixed(1)); break;
              case 'dayPower': values.todayEnergy = Number(o._value.toFixed(1)); break;
              case 'totalPower': values.totalVoltage = Number(o._value.toFixed(1)); break;
              case 'pv1_u': values.pv1Voltage = Number(o._value.toFixed(1)); break;
              case 'pv1_i': values.totalCurrent = Number(o._value.toFixed(1)); break;
              case 'mpptPower': values.mpptPower = Number(o._value.toFixed(1)); break;
            }
          },
          error: reject,
          complete: () => resolve(values)
        });
      });
    };

    const fetchAllData = async () => {
      const allData = await Promise.all(inverters.map(fetchDataForInverter));
      setCardsData(allData);
    };

    if (inverters.length > 0) {
      fetchAllData();
    }
  }, [inverters]);

  return (
    <Container>
      <HeaderBox>
        <Title>Dashboard</Title>
        <UserTag/>
      </HeaderBox>
      <Loading>
        {inverters.length === 0 ? (
          <Message>No devices assigned to this user.</Message>
        ) : (
          <>
            <CardGrid>
              {cardsData.map((inverter, index) => (
                <InverterCard key={index} inverter={inverter} />
              ))}
            </CardGrid>
            <MultiLineChartPage inverters={inverters}/>
          </>
        )}
      </Loading>
    </Container>
  );
};

export default Dashboard;
