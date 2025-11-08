export type TabID = 'dashboard' | 'production' | 'inventory' | 'formulas';

export interface InventoryItem {
  id: string;
  displayName: string;
  variableName: string;
  total: number;
  idealTotal: number;
  color: string;
  unit: string;
  orderIndex?: number;
}

export interface InventoryHistoryLog {
  id: string;
  itemId: string;
  itemDisplayName: string;
  change: number;
  newValue: number;
  timestamp: string;
}

export interface ProductionItem {
  id: string;
  name: string;
  description: string;
  requiredMaterials: { variableName: string; quantity: number }[];
  createdAt: string;
}

export interface Formula {
  id: string;
  name: string;
  condition: string;
  action: string;
  orderIndex: number;
}
