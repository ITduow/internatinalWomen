import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Dòng quan trọng nhất là BrowserRouter ở đây */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
