import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header'
import Home from './components/Pages/Home'
import './css/styles.css'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/inicio' element={<Home />} />
          <Route path='/tienda' />
          <Route path='/pedidos' />
          <Route path='/inventario' />
        </Routes>
      </Router>
    </>
  )
}

export default App
