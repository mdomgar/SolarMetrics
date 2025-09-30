import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RoleProvider, useRole } from './components/Contexts/RoleContext';
import { TokenProvider } from "./components/Contexts/TokenContext";

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <TokenProvider>
    <RoleProvider>
      <App />
    </RoleProvider>
  </TokenProvider>
  //</StrictMode>,
)
