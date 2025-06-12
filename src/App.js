import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/controle-pedidos" element={<ControlePedidos />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
