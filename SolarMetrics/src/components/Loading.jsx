import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import loadingGif from '../assets/loading2.gif';

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70%;
  text-align: center;
  background-color: #f9f9f9;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #555;
`;

const Loading = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!ready) {
    return (
        <LoaderWrapper>
        <img src={loadingGif} width={160} height={120} />
        <LoadingText>Loading...</LoadingText>
      </LoaderWrapper>
    );
  }

  return children;
};

export default Loading;
