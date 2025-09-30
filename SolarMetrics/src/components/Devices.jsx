import React, { createContext, useEffect, useState } from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRole } from "./Contexts/RoleContext";
import { useToken } from "./Contexts/TokenContext";
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
`;

const Table = styled.table`
  width: 90%;
  margin-left: 20px;
  color: black;
  background-color: white;
  border-radius: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f9f9f9;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const AddButton = styled(Button)`
  margin-top: 10px;
  margin-left: 16px;
`;

const SearchInput = styled.input`
  margin-left: 20px;
  margin-bottom: 20px;
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  width: 280px;
  font-size: 15px;
  background: #ffffff;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #4a90e2;
    background-color: #fdfdfd;
  }

  &::placeholder {
    color: #aaa;
  }
`;


const Devices = () => {
  const { role } = useRole();
  const { token } = useToken();
  const { currentUser } = useRole();
  const [inversores, setInversores] = useState([]);
  const [addingInversor, setAddingInversor] = useState(false);
  const [newInversorData, setNewInversorData] = useState({
    stationLabel: "",
  });
  const [editingInversor, setEditingInversor] = useState(null);
  const [editedInversorData, setEditedInversorData] = useState({
    stationLabel: ""
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/devices?username=${currentUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => setInversores(data))
      .catch((err) => {
        toast.error(error.response?.data || "Error obtaining inversors");
      });
  }, [token]);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewInversorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNewInversor = () => {
    if (!newInversorData.stationLabel) {
      toast.error("All fields are required");
    } else {
      fetch("http://localhost:8080/devices/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInversorData),
      })
        .then((res) => res.json())
        .then((data) => {
          setInversores((prevInversores) => [...prevInversores, data]);
          setAddingInversor(false);
          setNewInversorData({ stationLabel: ""});
          toast.success("Inversor successfully added");
        })
        .catch((err) => {
          console.error("Error adding inversor:", err);
          toast.error("Error adding inversor");
        });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedInversorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveEdit = (id) => {
    fetch(`http://localhost:8080/devices/edit/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedInversorData),
    })
      .then((res) => res.json())
      .then((data) => {
        setInversores((prevState) =>
          prevState.map((inversor) =>
            inversor.deviceId === id ? { ...inversor, ...editedInversorData } : inversor
          )
        );
        setEditingInversor(null);
        toast.success("Inversor successfully edited");
      })
      .catch((err) => {
        console.error("Error saving inversor:", err);
        toast.error("Error saving inversor");
      });
  };

  const handleCancelEdit = () => {
    setEditingInversor(null);
  };

  const editInversor = (inversor) => {
    setEditingInversor(inversor.deviceId);
    setEditedInversorData({ stationLabel: inversor.stationLabel, totalPower: inversor.totalPower });
  };

  const deleteInversor = (id) => {
    if (window.confirm("Are you sure you want to delete this inversor?")) { 
      fetch(`http://localhost:8080/devices/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then((res) => {
          if (!res.ok) {
            toast.error("Error deleting inversor");
            throw new Error("Error deleting inversor");
          }
          setInversores((prevState) => prevState.filter((inversor) => inversor.deviceId !== id));
          toast.success("Inversor successfully removed");
        })
        .catch((err) => {
          console.error("Error deleting inversor:", err);
          toast.error("Error deleting inversor");
        });
    }
  };

  const navigate = useNavigate();

  return (
    <Container>
      <HeaderBox>
        <Title>Devices</Title>
        <UserTag/>
      </HeaderBox>
      <SearchInput
        type="text"
        placeholder="Search a station label"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        <Table>
          <thead>
            <tr>
              <Th>Device ID</Th>
              <Th>Station Label</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {inversores
              .filter((inversor) =>
                inversor.stationLabel.toLowerCase().includes(search.toLowerCase())
              )
              .map((inversor) => (
              <tr key={inversor.deviceId}>
                <Td>{inversor.deviceId}</Td>
                <Td>
                  {editingInversor === inversor.deviceId ? (
                    <input
                      type="text"
                      name="stationLabel"
                      value={editedInversorData.stationLabel}
                      onChange={handleEditChange}
                    />
                  ) : (
                    inversor.stationLabel
                  )}
                </Td>
                <Td>
                  {editingInversor === inversor.deviceId ? (
                    <>
                      <Button onClick={() => handleSaveEdit(inversor.deviceId)}>
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit}>Cancel</Button>
                    </>
                  ) : (
                    <>
                     <Button onClick={() => navigate(`/devices/${inversor.deviceId}`, {
                       state: { stationLabel: inversor.stationLabel, deviceId: inversor.deviceId} })}>View details</Button>
                       {role === "ADMIN" && (
                        <>
                      <Button onClick={() => editInversor(inversor)}>Edit</Button>
                      <Button onClick={() => deleteInversor(inversor.deviceId)}>
                        Delete
                      </Button>
                      </>
                       )}
                    </>
                  )}
                </Td>
              </tr>
            ))}
            {addingInversor && (
              <tr>
                <Td>Nuevo</Td>
                <Td>
                  <input
                    type="text"
                    name="stationLabel"
                    value={newInversorData.stationLabel}
                    onChange={handleAddChange}
                  />
                </Td>
                <Td>
                  <Button onClick={handleSaveNewInversor}>Save</Button>
                  <Button onClick={() => setAddingInversor(false)}>Cancel</Button>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        {role === "ADMIN" && (<AddButton onClick={() => setAddingInversor(true)}>Add Inversor</AddButton>)}
      <ToastContainer />
    </Container>
  );
};

export default Devices;
