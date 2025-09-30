import React, { useEffect, useState } from "react";
import { Chip, Autocomplete, TextField } from "@mui/material";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { useToken } from "./Contexts/TokenContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const DeviceManager = ({ user, onDevicesUpdate }) => {
  const {token} = useToken();
  const [allDevices, setAllDevices] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/devices/get", { headers: {
      Authorization: `Bearer ${token}`,
    }
  })
      .then((res) => res.json())
      .then((data) => setAllDevices(data));

    fetch(`http://localhost:8080/admin/users/${user.id}/devices`, { headers: {
      Authorization: `Bearer ${token}`,
    }
  })
      .then((res) => res.json())
      .then((devices) => setUserDevices(devices));
  }, [user.id]);

  const handleAddDevice = (deviceId) => {
    if (!userDevices.some((device) => device.deviceId === deviceId)) {
      const updated = [...userDevices, { deviceId }];
      setUserDevices(updated);
      updateDevices(updated);
    }

  };

  const handleRemoveDevice = (deviceId) => {
    const updated = userDevices.filter((device) => device.deviceId !== deviceId);
    setUserDevices(updated);
    updateDevices(updated);
  };

  const updateDevices = (devices) => {
    const deviceIds = devices.map((device) => device.deviceId);
    
    fetch(`http://localhost:8080/admin/users/${user.id}/devices`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" },
      body: JSON.stringify(deviceIds),
    })
      .then(() => {
        onDevicesUpdate(user.id, deviceIds);
        setUserDevices(devices);
        toast.success("Update of user successfull");
      })
      .catch((e) => {
        toast.error("Error updating user's devices");
      });
  };

  return (
    <Container>
      <ChipWrapper>
        {userDevices.map((device) => (
          <Chip
            key={device.deviceId}
            label={allDevices.find((d) => d.deviceId === device.deviceId)?.stationLabel || `Device ${device.deviceId}`}
            onDelete={() => handleRemoveDevice(device.deviceId)}
          />
        ))}
      </ChipWrapper>
      <Autocomplete
        value={selectedDevice}
        options={allDevices.filter(
          (device) => !userDevices.some((ud) => ud.deviceId === device.deviceId)
        )}
        getOptionLabel={(option) => option.stationLabel || ""}
        onChange={(event, newValue) => {
          if (newValue) {
            handleAddDevice(newValue.deviceId);
            setSelectedDevice(null);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Add device" variant="standard" />
        )}
        style={{ width: 150 }}
      />
    </Container>
  );
};

export default DeviceManager;