// LoginPedidos.js
import React, { useState } from "react";

const LoginPedidos = ({ onLogin }) => {
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (senha === "marmita123") {
      localStorage.setItem("autorizado", "true");
      onLogin();
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Acesso Restrito</h2>
        <input
          type="password"
          placeholder="Digite a senha"
          className="border p-2 rounded w-full mb-4"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#5d3d29] text-white py-2 px-4 rounded w-full hover:bg-[#5d3d29]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPedidos;
