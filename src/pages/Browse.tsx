
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';

const Browse = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, searchTerm, setSearchTerm } = useMarketplace();
  
  const [filteredItems, setFilteredItems] = useState(items);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  useEffect(() => {
    let result = [...items];
    
    // Filter by availability
    result = result.filter(item => item.isAvailable);
    
    // Filter out current user's items
    if (currentUser) {
      result = result.filter(item => item.sellerId !== currentUser.id);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply price filters
    if (minPrice !== '') {
      result = result.filter(item => item.price >= Number(minPrice));
    }
    
    if (maxPrice !== '') {
      result = result.filter(item => item.price <= Number(maxPrice));
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, categoryFilter, minPrice, maxPrice, currentUser]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Items</h1>
          <p className="text-muted-foreground">
            Discover items from various sellers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center mb-3">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Price Range</Label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Min"
                              className="pl-7"
                              value={minPrice}
                              onChange={e => setMinPrice(e.target.value)}
                            />
                          </div>
                          <span className="text-gray-500">-</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Max"
                              className="pl-7"
                              value={maxPrice}
                              onChange={e => setMaxPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setCategoryFilter('all');
                      setMinPrice('');
                      setMaxPrice('');
                      setSearchTerm('');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Item Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Search for items..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center p-12 border rounded-md bg-gray-50">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button variant="outline" onClick={() => {
                  setCategoryFilter('all');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchTerm('');
                }}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {item.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-marketplace-primary font-medium mb-2">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Seller: {item.sellerName}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/item/${item.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Browse;
