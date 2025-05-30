import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos"; // importe a nova página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/controle-pedidos" element={<ControlePedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
