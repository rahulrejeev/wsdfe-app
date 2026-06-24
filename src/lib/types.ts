export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  sku: string | null;
  created_at: string;
  updated_at: string;
};

export type InventoryLogEntry = {
  id: string;
  item_id: string;
  delta: number;
  quantity_after: number;
  created_at: string;
};
