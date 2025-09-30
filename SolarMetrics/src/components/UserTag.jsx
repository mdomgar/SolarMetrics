import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useRole } from './Contexts/RoleContext';

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #1e293b;
  border-radius: 999px;
  color: white;
  font-weight: bold;
`;

const Username = styled.span`
  font-size: 0.95rem;
`;



const UserTag = () => {
    const { currentUser } = useRole();
    return (
    <TagContainer>
      <FaUserCircle size={20} />
      <Username>{currentUser}</Username>
    </TagContainer>
  );
};

export default UserTag;
