import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/controle-pedidos" element={<ControlePedidos />} />
    </Routes>
  );
}

export default App;
