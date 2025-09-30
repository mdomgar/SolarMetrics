import { useEffect, useState } from 'react';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Container = styled.div`
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 450px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoCard = styled.div`
  background-color: ${({ selected }) => (selected ? '#4B5563' : 'white')};
  color: ${({ selected }) => (selected ? 'white' : '#4B5563')};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;

  button {
    background-color: #4B5563;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
  }

  button:hover {
    opacity: 0.85;
  }
`;


const InfoLabel = styled.p`
  font-size: 0.875rem;
`;

const InfoValue = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
`;

const Graphic = ({deviceId}) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState("activePower");
  const ip = import.meta.env.VITE_SERVICES_IP;

  useEffect(() => {
    const url = `http://${ip}:8086`;
    const token = 'psO1oImBZWlAxJqMTwqtsdRMHHVaAajVWbD-MIPrDqFktIwA5iVlJgsJ6pjf9iJ2bCRUSxL44HCt4xSlsjstOw==';
    const org = 'mdomgar';
    const bucket = 'SolarData';

    const client = new InfluxDB({ url, token });
    const queryClient = client.getQueryApi(org);

    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r["deviceId"] == "${deviceId}")
        |> filter(fn: (r) => r["_field"] == "activePower" or r["_field"] == "dayPower" or r["_field"] == "totalPower" or r["_field"] == "mpptPower" or r["_field"] == "pv1_u" or r["_field"] == "pv1_i")
    `;

    const tempData = {  
      activePower: [],
      dayPower: [],
      totalPower: [],
      mpptPower: [],
      pv1_u: [],
      pv1_i: [],
      times: []
    };

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        const time = new Date(o._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (!tempData.times.includes(time)) {
          tempData.times.push(time);
        }

        if (o._field === "activePower") {
          tempData.activePower.push(o._value);
        } else if (o._field === "dayPower") {
          tempData.dayPower.push(o._value);
        } else if (o._field === "totalPower") {
          tempData.totalPower.push(o._value);
        } else if (o._field === "mpptPower") {
          tempData.mpptPower.push(o._value);
        } else if (o._field === "pv1_u") {
          tempData.pv1_u.push(o._value);
        } else if (o._field === "pv1_i") {
          tempData.pv1_i.push(o._value);
        }
      },
      error: (err) => {
        console.error('Error en la consulta:', err);
        setError('Hubo un error al obtener los datos.');
      },
      complete: () => {
        setData(tempData);

        if (tempData.times.length === 0) {
          setStatus('Idle');
        } else {
          const lastTimestamp = new Date(tempData.times[tempData.times.length - 1]).getTime();
          const now = Date.now();
          
          const diff = now - lastTimestamp;
        
          if (diff > 5 * 60 * 1000) {
            setStatus('Idle');
          } else {
            setStatus('Active');
          }
        }
      }
    });
  }, []);

  if (error) return <div>{error}</div>;

  const chartData = {
    labels: data.times,
    datasets: [
      {
        label: selectedField,
        data: data[selectedField] || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        title: {
          display: true,
          text: 'Power (Kw)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} Kw`;
          }
        }
      }
    }
  };

  const getAVG = (arr) => {
    if (!arr || arr.length === 0) return null;
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
  };

  return (
    <Container>
      <Grid>
        <ChartCard>
          <Line data={chartData} options={chartOptions} />
        </ChartCard>
        <InfoPanel>
          <InfoCard>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>{status}</InfoValue>
          </InfoCard>
          <InfoCard selected={selectedField === "activePower"}>
            <InfoLabel>Active Power</InfoLabel>
            <InfoValue>{getAVG(data.activePower) ?? '---'} kWh</InfoValue>
            {selectedField !== "activePower" &&   
              <button onClick={() => setSelectedField("activePower")}>View table</button>
            }
          </InfoCard>
          <InfoCard selected={selectedField === "mpptPower"}>
            <InfoLabel>MPPT Power</InfoLabel>
            <InfoValue>{getAVG(data.mpptPower) ?? '---'} W</InfoValue>
            {selectedField !== "mpptPower" &&   
              <button onClick={() => setSelectedField("mpptPower")}>View table</button>
            }
          </InfoCard>
          <InfoCard selected={selectedField === "dayPower"}>
            <InfoLabel>Day Power</InfoLabel>
            <InfoValue>{getAVG(data.dayPower) ?? '---'} W</InfoValue>
            {selectedField !== "dayPower" &&   
              <button onClick={() => setSelectedField("dayPower")}>View table</button>
            }
          </InfoCard>
          <InfoCard selected={selectedField === "totalPower"}>
            <InfoLabel>Total Power</InfoLabel>
            <InfoValue>{getAVG(data.totalPower) ?? '---'} kWh</InfoValue>
            {selectedField !== "totalPower" &&   
              <button onClick={() => setSelectedField("totalPower")}>View table</button>
            }
          </InfoCard>
          <InfoCard selected={selectedField === "pv1_u"}>
            <InfoLabel>PV1</InfoLabel>
            <InfoValue>{getAVG(data.pv1_u) ?? '---'} V / {getAVG(data.pv1_i) ?? '---'} A</InfoValue>
            {selectedField !== "pv1_u" &&   
              <button onClick={() => setSelectedField("pv1_u")}>View table</button>
            }
          </InfoCard>
        </InfoPanel>
      </Grid>
    </Container>
  );
};

export default Graphic;
