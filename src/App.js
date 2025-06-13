import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ControlePedidos from "./pages/ControlePedidos";
import Dashboard from "./pages/Dashboard";
import Table from "./pages/Table";
import KitchenDashboard from "./dashboard/KitchenDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/controle-pedidos" element={<ControlePedidos />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mesa" element={<Table />} />
      <Route path="/cozinha" element={<KitchenDashboard />} />
    </Routes>
  );
}

export default App;
