
import { User, Item, Transaction } from '../types';

// Mock users data
export const users: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    cashBalance: 1000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'alice_smith',
    email: 'alice@example.com',
    cashBalance: 1500,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'bob_johnson',
    email: 'bob@example.com',
    cashBalance: 800,
    createdAt: new Date().toISOString(),
  },
];

// Mock items data
export const items: Item[] = [
  {
    id: '1',
    name: 'Vintage Camera',
    description: 'A beautiful vintage camera in excellent condition.',
    price: 150,
    sellerId: '2',
    sellerName: 'alice_smith',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Mountain Bike',
    description: 'High-quality mountain bike, perfect for trails.',
    price: 350,
    sellerId: '3',
    sellerName: 'bob_johnson',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2068&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: 'Sports',
  },
  {
    id: '3',
    name: 'Antique Clock',
    description: 'Beautiful antique wall clock from the 1920s.',
    price: 200,
    sellerId: '2',
    sellerName: 'alice_smith',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1584112276723-cc458f14ee07?q=80&w=1974&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: 'Antiques',
  },
  {
    id: '4',
    name: 'Designer Handbag',
    description: 'Authentic designer handbag, barely used.',
    price: 300,
    sellerId: '1',
    sellerName: 'john_doe',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: 'Fashion',
  },
  {
    id: '5',
    name: 'Smart Speaker',
    description: 'Latest generation smart speaker with voice assistant.',
    price: 120,
    sellerId: '3',
    sellerName: 'bob_johnson',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1558089687-db9280019010?q=80&w=1974&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: 'Electronics',
  },
];

// Mock transactions data
export const transactions: Transaction[] = [
  {
    id: '1',
    itemId: '6',
    itemName: 'Leather Jacket',
    sellerId: '2',
    buyerId: '1',
    price: 180,
    date: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
  },
  {
    id: '2',
    itemId: '7',
    itemName: 'Wireless Headphones',
    sellerId: '3',
    buyerId: '2',
    price: 90,
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
];
