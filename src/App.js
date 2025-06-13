import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos";
import Dashboard from "./pages/Dashboard";
import Mesa from "./pages/Mesa";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/controle-pedidos" element={<ControlePedidos />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mesa" element={<Mesa />} />
    </Routes>
  );
}

export default App;
