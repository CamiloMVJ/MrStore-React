import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home.jsx'
import Login from "./Pages/Login.jsx";
import Perfil from "./Pages/Perfil.jsx";
import Tienda from "./Pages/Tienda.jsx";
import DetalleProd from "./Pages/DetalleProd.jsx";
import ErrorBoundary from './components/ErrorBoundry.jsx';
import SignUpMeth from './Pages/SignUp.jsx';
import Inventario from './Pages/Inventario.jsx';
import Cart from './Pages/Cart.jsx';
import Pedidos from './Pages/Pedidos.jsx';
import DetPedidos from './Pages/DetPedidos.jsx';
import './css/styles.css'

import { CartProvider } from './context/CartContext';

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <ErrorBoundary /> },
  { path: '/tienda', element: <Tienda />, errorElement: <ErrorBoundary /> },
  { path: '/tienda/:categoria', element: <Tienda /> },
  { path: '/DetProd/:id_prod', element: <DetalleProd /> },
  { path: '/login', element: <Login /> },
  { path: '/perfil', element: <Perfil /> },
  { path: '/signup', element: <SignUpMeth /> },
  { path: '/cart', element: <Cart /> },
  { path: '/Inventario', element: <Inventario /> },
  { path: '/Pedidos', element: <Pedidos /> },
  { path: '/DetPedidos/:id_pedido', element: <DetPedidos /> },
  { path: '/passrecovery', element: <ErrorBoundary /> },
])


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //     <App />
  // </StrictMode>,

  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)
