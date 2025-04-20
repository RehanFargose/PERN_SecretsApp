import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";

// Import the web pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NoPage from "./pages/NoPage";
import SecretsPage from './pages/SecretsPage';

import './styles/styles.css';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/home" element={<HomePage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/register" element={<RegisterPage/>} />
              <Route path="/secrets" element={<SecretsPage/>} />
              <Route path="*" element={<NoPage/>} />
          </Routes>
      
      
      </BrowserRouter>
    </>
  )
}

export default App;
