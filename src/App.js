import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos"; // importe a nova página
import CarrinhoMarmitas from "./pages/CarrinhoMarmitas"; // importe a nova página


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/controle-pedidos" element={<ControlePedidos />} />
        <Route path="/Carrinho-Marmitas" element={<CarrinhoMarmitas />} />
        <Route path="/Home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
