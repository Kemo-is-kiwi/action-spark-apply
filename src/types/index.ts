
export interface User {
  id: string;
  username: string;
  email: string;
  cashBalance: number;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  sellerName: string;
  isAvailable: boolean;
  image?: string;
  createdAt: string;
  category: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  sellerId: string;
  buyerId: string;
  price: number;
  date: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  data: any;
  createdAt: string;
}
