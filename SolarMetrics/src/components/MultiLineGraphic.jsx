import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 2rem;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const ChartCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const SelectButton = styled.button`
  background-color: ${({ selected }) => (selected ? "#007bff" : "#e0e0e0")};
  color: ${({ selected }) => (selected ? "white" : "#333")};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#0056b3" : "#ccc")};
  }
`;

function getColorManager() {
  const colorPalette = [
    "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#3B3EAC", "#0099C6",
    "#DD4477", "#66AA00", "#B82E2E", "#316395", "#994499", "#22AA99", "#AAAA11",
    "#6633CC", "#E67300", "#8B0707", "#329262", "#5574A6", "#3B3EAC",
  ];
  const availableColors = [...colorPalette];
  const assignedColors = {};

  return (label) => {
    if (!assignedColors[label]) {
      if (availableColors.length === 0) {
        // If colors run out, assign a random color
        assignedColors[label] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      } else {
        assignedColors[label] = availableColors.shift();
      }
    }
    return assignedColors[label];
  };
}

const MultiLineChartPage = ({ inverters }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedField, setSelectedField] = useState("activePower");

  const ip = import.meta.env.VITE_SERVICES_IP;
  const token = import.meta.env.VITE_SERVICES_TOKEN;

  const availableFields = [
    "activePower",
    "dayPower",
    "totalPower",
    "mpptPower",
    "pv1_u",
    "pv1_i",
  ];

  const fieldLabels = {
    activePower: "Active Power",
    dayPower: "Day Power",
    totalPower: "Total Power",
    mpptPower: "MPPT Power",
    pv1_u: "PV1 Voltage",
    pv1_i: "PV1 Power",
  };

  const fieldUnits = {
    activePower: "Active Power (kW)",
    dayPower: "Day Power (kWh)",
    totalPower: "Total Power (kWh)",
    mpptPower: "MPPT Power (W)",
    pv1_u: "PV1 Voltage (V)",
    pv1_i: "PV1 Power (A)",
  };

  useEffect(() => {
    const deviceIds = inverters.map((i) => i.deviceId);
    if (deviceIds.length === 0) return;

    const url = `http://${ip}:8086`;
    const influxToken = `${token}`;
    const org = "mdomgar";
    const bucket = "SolarData";

    const client = new InfluxDB({ url, token: influxToken });
    const queryClient = client.getQueryApi(org);

    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -30m)
        |> filter(fn: (r) => ${deviceIds
          .map((id) => `r["deviceId"] == "${id}"`)
          .join(" or ")})
        |> filter(fn: (r) => r["_field"] == "${selectedField}")
        |> group(columns: ["stationLabel"])
    `;

    const tempData = {};
    const timeLabels = new Set();

    const colorForLabel = getColorManager();

    queryClient.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        const time = new Date(o._time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeLabels.add(time);

        const stationLabel = o.stationLabel;
        if (!tempData[stationLabel]) {
          tempData[stationLabel] = {};
        }
        tempData[stationLabel][time] = o._value;
      },
      complete: () => {
        const labels = Array.from(timeLabels).sort();
        const datasets = Object.entries(tempData).map(
          ([stationLabel, values]) => ({
            label: stationLabel,
            data: labels.map((t) => values[t] ?? null),
            borderColor: colorForLabel(stationLabel),
            backgroundColor: "transparent",
            tension: 0.4,
          })
        );

        setChartData({ labels, datasets });
      },
      error: (err) => {
        console.error("Error fetching data:", err);
      },
    });
  }, [inverters, selectedField]);

  if (!chartData) return <Container>Cargando gráfico...</Container>;

  return (
    <Container>
      <ButtonContainer>
        {availableFields.map((field) => (
          <SelectButton
            key={field}
            selected={selectedField === field}
            onClick={() => setSelectedField(field)}
          >
            {fieldLabels[field]}
          </SelectButton>
        ))}
      </ButtonContainer>
      <ChartCard>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: fieldUnits[selectedField] || "",
                },
              },
            },
            spanGaps: true,
          }}
        />
      </ChartCard>
    </Container>
  );
};

export default MultiLineChartPage;