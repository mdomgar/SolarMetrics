import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import DeviceManager from "./DeviceManager";
import { useToken } from "./Contexts/TokenContext";
import { useRole } from "./Contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import UserTag from "./UserTag";

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
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

const Text = styled.p`
  color: black;
  padding-left: 16px;
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


const Users = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const { currentUser } = useRole();
  const [users, setUsers] = useState([]);
  const [addingUser, setAddingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/admin/users", {
      headers: {
      Authorization: `Bearer ${token}`,
    }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error obtaining users:", err);
        toast.error(error.response?.data || "Error obtaining users");
      });
  }, []);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNewUser = () => {
    if (!newUserData.username || !newUserData.password) {
      toast.error("All fields are required");
    } else {
      fetch("http://localhost:8080/admin/users/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers((prevUsers) => [...prevUsers, data]);
          setAddingUser(false);
          setNewUserData({ username: "", password: "", role: "USER" });
          toast.success("User successfully added");
        })
        .catch((err) => {
          console.error("Error adding user:", err);
          toast.error("Error adding user:");
        });
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveEdit = (id) => {
    const editedUser = users.find((user) => user.id === id);
    let confirm = false;
    if(editedUser.username === currentUser) {
      confirm = window.confirm("Estás editando tu propio usuario. Esto cerrará tu sesión. ¿Deseas continuar?")
      if (!confirm) {
        return;
      }
    }
    fetch(`http://localhost:8080/admin/users/edit/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUserData),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === id ? { ...user, ...editedUserData } : user
          )
        );
        setEditingUser(false); 
        toast.success("User successfully edited");
      })
      .catch((err) => console.error("Error saving user:", err));

      if(confirm) {
        localStorage.removeItem("jwtToken");
      
        navigate("/login");
      }
  };

  const handleCancelEdit = () => {
    setEditingUser(false);
  };

  const editUser = (user) => {
    setEditingUser(user.id);
    setEditedUserData({ username: user.username, role: user.role });
  };

  const deleteUser = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      fetch(`http://localhost:8080/admin/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then((res) => {
          if (!res.ok) {
            toast.error("Error al eliminar el usuario");
            throw new Error("Error deleting user");
          }
          setUsers((prevState) => prevState.filter((user) => user.id !== id));
          toast.success("User successfully removed");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  return (
    <Container>
      <HeaderBox>
        <Title>User Accounts</Title>
        <UserTag/>
      </HeaderBox>

      {users.length === 0 ? (
        <Text>No hay usuarios disponibles.</Text>
      ) : (
        <>
          <SearchInput
                  type="text"
                  placeholder="Search an user"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Password</Th>
                <Th>Role</Th>
                <Th>Devices</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) =>
                  user.username.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                <tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        name="username"
                        value={editedUserData.username}
                        onChange={handleEditChange}
                      />
                    ) : (
                      user.username
                    )}
                  </Td>
                  <Td>
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        name="password"
                        onChange={handleEditChange}
                      />
                    ) : (
                      "********"
                    )}
                  </Td>
                  <Td>
                    {editingUser === user.id ? (
                      <select
                        name="role"
                        value={editedUserData.role}
                        onChange={handleEditChange}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </Td>
                  <Td>
                    <DeviceManager
                      user={user}
                      onDevicesUpdate={(userId, updatedDevices) => {
                        setUsers((prevUsers) =>
                          prevUsers.map((u) =>
                            u.id === userId
                              ? { ...u, deviceIds: updatedDevices }
                              : u
                          )
                        );
                      }}
                    />
                  </Td>
                  <Td>
                    {editingUser === user.id ? (
                      <>
                        <Button onClick={() => handleSaveEdit(user.id)}>
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => editUser(user)}>Edit</Button>
                        <Button onClick={() => deleteUser(user.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </Td>
                </tr>
              ))}
              {addingUser && (
                <tr>
                  <Td>Nuevo</Td>
                  <Td>
                    <input
                      type="text"
                      name="username"
                      value={newUserData.username}
                      onChange={handleAddChange}
                    />
                  </Td>
                  <Td>
                    <input
                      type="password"
                      name="password"
                      value={newUserData.password}
                      onChange={handleAddChange}
                    />
                  </Td>
                  <Td>
                    <select
                      name="role"
                      value={newUserData.role}
                      onChange={handleAddChange}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </Td>
                  <Td>
                    <Button onClick={handleSaveNewUser}>Save</Button>
                    <Button onClick={() => setAddingUser(false)}>Cancel</Button>
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
          <AddButton onClick={() => setAddingUser(true)}>Add user</AddButton>
        </>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Users;
