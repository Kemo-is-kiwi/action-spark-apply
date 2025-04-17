
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Transaction } from '../types';
import { items as initialItems, transactions as initialTransactions } from '../services/mockData';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface MarketplaceContextType {
  items: Item[];
  userItems: Item[];
  purchasedItems: Item[];
  transactions: Transaction[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addItem: (item: Omit<Item, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
  purchaseItem: (itemId: string) => void;
  getItemById: (id: string) => Item | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType>({
  items: [],
  userItems: [],
  purchasedItems: [],
  transactions: [],
  searchTerm: '',
  setSearchTerm: () => {},
  addItem: () => {},
  updateItem: () => {},
  removeItem: () => {},
  purchaseItem: () => {},
  getItemById: () => undefined,
});

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');

  // Items being sold by the current user
  const userItems = currentUser 
    ? items.filter(item => item.sellerId === currentUser.id) 
    : [];

  // Items purchased by the current user
  const purchasedItems = currentUser 
    ? transactions
        .filter(t => t.buyerId === currentUser.id)
        .map(t => {
          // Find the item in the items list or create a placeholder
          const item = items.find(i => i.id === t.itemId);
          if (item) return item;
          
          // If the item is not in the items list (it might have been deleted),
          // create a placeholder item with the transaction data
          return {
            id: t.itemId,
            name: t.itemName,
            description: 'No description available',
            price: t.price,
            sellerId: t.sellerId,
            sellerName: 'Unknown Seller',
            isAvailable: false,
            createdAt: t.date,
            category: 'Unknown',
          };
        })
    : [];

  const addItem = (itemData: Omit<Item, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newItem: Item = {
      ...itemData,
      id: (items.length + 1).toString(),
      sellerId: currentUser.id,
      sellerName: currentUser.username,
      createdAt: new Date().toISOString(),
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    toast.success("Item listed successfully!");
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast.success("Item updated successfully!");
  };

  const removeItem = (id: string) => {
    if (!currentUser) return;
    
    const item = items.find(i => i.id === id);
    if (!item || item.sellerId !== currentUser.id) {
      toast.error("You can only remove your own items");
      return;
    }
    
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Item removed successfully!");
  };

  const purchaseItem = (itemId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to purchase items");
      return;
    }
    
    const item = items.find(i => i.id === itemId);
    if (!item) {
      toast.error("Item not found");
      return;
    }
    
    if (!item.isAvailable) {
      toast.error("This item is no longer available");
      return;
    }
    
    if (item.sellerId === currentUser.id) {
      toast.error("You cannot purchase your own item");
      return;
    }
    
    if (currentUser.cashBalance < item.price) {
      toast.error("Insufficient funds. Please deposit more cash.");
      return;
    }
    
    // Create a new transaction
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      itemId: item.id,
      itemName: item.name,
      sellerId: item.sellerId,
      buyerId: currentUser.id,
      price: item.price,
      date: new Date().toISOString(),
    };
    
    // Update the item to be no longer available
    updateItem(itemId, { isAvailable: false });
    
    // Add the new transaction
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update the buyer's balance (handled in AuthContext)
    // This would typically be handled by a backend API
    
    toast.success(`You have successfully purchased ${item.name}!`);
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        items,
        userItems,
        purchasedItems,
        transactions,
        searchTerm,
        setSearchTerm,
        addItem,
        updateItem,
        removeItem,
        purchaseItem,
        getItemById,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
