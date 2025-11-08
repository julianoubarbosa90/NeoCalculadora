
import React from 'react';

const DashboardTab: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl border border-neutral-800">
        <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo ao Gerenciador de Banco de Dados</h1>
        <p className="text-lg text-neutral-400 mb-6">
          Utilize as abas à esquerda para navegar entre as seções de Produção, Estoque e Fórmulas.
          Esta aplicação foi projetada para simplificar o gerenciamento de seus dados de produção e inventário no Firebase.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Produção</h2>
            <p className="text-neutral-400">Descreva e gerencie as peças que serão produzidas.</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Estoque</h2>
            <p className="text-neutral-400">Controle materiais e acessórios com ajustes rápidos.</p>
          </div>
          <div className="bg-neutral-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Fórmulas</h2>
            <p className="text-neutral-400">Crie relações dinâmicas entre seus dados de estoque.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
