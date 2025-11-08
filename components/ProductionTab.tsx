
import React, { useState, useEffect } from 'react';
import type { ProductionItem } from '../types';
import { firebaseService } from '../services/firebaseService';

const ProductionTab: React.FC = () => {
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const productionItems = await firebaseService.getProductionItems();
      setItems(productionItems);
      setIsLoading(false);
    };
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: Omit<ProductionItem, 'id'> = {
      name: newItemName,
      description: newItemDesc,
      requiredMaterials: [], // Simplified for this example
      createdAt: new Date().toISOString(),
    };

    const addedItem = await firebaseService.addProductionItem(newItem);
    setItems(prev => [...prev, addedItem]);
    setNewItemName('');
    setNewItemDesc('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Gerenciamento de Produção</h1>
      
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Adicionar Nova Peça de Produção</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-neutral-300 mb-1">Nome da Peça</label>
            <input
              id="itemName"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Ex: Cadeira de Madeira"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label htmlFor="itemDesc" className="block text-sm font-medium text-neutral-300 mb-1">Descrição</label>
            <textarea
              id="itemDesc"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              placeholder="Detalhes sobre a produção da peça..."
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-800 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-rose-600 transition-colors"
          >
            Adicionar Peça
          </button>
        </form>
      </div>

      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Peças em Produção</h2>
        {isLoading ? <p className="text-neutral-400">Carregando...</p> : (
          <div className="space-y-3">
            {items.length === 0 ? <p className="text-neutral-400">Nenhuma peça de produção adicionada.</p> :
              items.map(item => (
                <div key={item.id} className="bg-neutral-800 p-4 rounded-md">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-neutral-400">{item.description}</p>
                  <p className="text-xs text-neutral-500 mt-2">Criado em: {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionTab;
