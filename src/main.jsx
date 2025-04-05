import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import Home from './components/Pages/Home.jsx'
import Login from "./components/Pages/Login.jsx";
import Perfil from "./components/Pages/Perfil.jsx";
import Tienda from "./components/Pages/Tienda.jsx";
import DetalleProd from "./components/Pages/DetalleProd.jsx";
import ErrorBoundary from './components/ErrorBoundry.jsx';
import './css/styles.css'

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <ErrorBoundary /> },
  { path: '/tienda', element: <Tienda /> },
  { path: '/tienda/:categoria', element: <Tienda /> },
  { path: '/DetProd/:id_prod', element: <DetalleProd /> },
  { path: '/login', element: <Login /> },
  { path: '/perfil', element: <Perfil /> },
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //     <App />
  // </StrictMode>,

  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
