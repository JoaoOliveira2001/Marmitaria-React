import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos";
import CarrinhoMarmitas from "./pages/CarrinhoMarmitas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/controle-pedidos" element={<ControlePedidos />} />
      <Route path="/Carrinho-Marmitas" element={<CarrinhoMarmitas />} />
    </Routes>
  );
}

export default App;
