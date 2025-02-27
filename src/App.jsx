import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Pages/Home'
import './css/styles.css'
import Login from "./components/Pages/Login";
import Perfil from "./components/Pages/Perfil";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tienda' />
          <Route path='/pedidos' />
          <Route path='/inventario' />
          <Route path="/login" element={<Login />}/>
          <Route path="/perfil" element ={<Perfil/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
