
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Reports = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { items, transactions, userItems, purchasedItems } = useMarketplace();
  
  const [activeTab, setActiveTab] = useState("summary");

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Generate category data for pie chart
  const generateCategoryData = () => {
    const categoryCount: Record<string, number> = {};
    items.forEach(item => {
      if (categoryCount[item.category]) {
        categoryCount[item.category]++;
      } else {
        categoryCount[item.category] = 1;
      }
    });
    
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  // COLORS for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8DD1E1'];

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total sales and purchases for the current user
  const totalSales = transactions
    .filter(t => t.sellerId === currentUser?.id)
    .reduce((sum, t) => sum + t.price, 0);
    
  const totalPurchases = transactions
    .filter(t => t.buyerId === currentUser?.id)
    .reduce((sum, t) => sum + t.price, 0);

  // Generate price range data for bar chart
  const generatePriceRangeData = () => {
    const ranges = [
      { range: '$0-$50', count: 0 },
      { range: '$51-$100', count: 0 },
      { range: '$101-$200', count: 0 },
      { range: '$201-$300', count: 0 },
      { range: '$301+', count: 0 },
    ];
    
    items.forEach(item => {
      if (item.price <= 50) ranges[0].count++;
      else if (item.price <= 100) ranges[1].count++;
      else if (item.price <= 200) ranges[2].count++;
      else if (item.price <= 300) ranges[3].count++;
      else ranges[4].count++;
    });
    
    return ranges;
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">
            <BarChart3 className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <List className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentUser?.cashBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Available for purchases</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {transactions.filter(t => t.sellerId === currentUser?.id).length} items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPurchases.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From {transactions.filter(t => t.buyerId === currentUser?.id).length} items</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Items</CardTitle>
                <CardDescription>
                  Current listings vs. sold items
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active Listings', value: userItems.filter(i => i.isAvailable).length },
                        { name: 'Sold Items', value: userItems.filter(i => !i.isAvailable).length }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>
                  Purchases vs. Sales
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Purchases', value: purchasedItems.length },
                      { name: 'Active Listings', value: userItems.filter(i => i.isAvailable).length },
                      { name: 'Sold Items', value: userItems.filter(i => !i.isAvailable).length }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Items by Category</CardTitle>
                <CardDescription>
                  Distribution of items across categories
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Distribution</CardTitle>
                <CardDescription>
                  Items by price range
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generatePriceRangeData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Items" fill="#8884d8">
                      {generatePriceRangeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace Overview</CardTitle>
              <CardDescription>
                Current state of the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-semibold">{items.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Available Items</p>
                  <p className="text-2xl font-semibold">{items.filter(i => i.isAvailable).length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sold Items</p>
                  <p className="text-2xl font-semibold">{items.filter(i => !i.isAvailable).length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Sellers</p>
                  <p className="text-2xl font-semibold">
                    {new Set(items.map(i => i.sellerId)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                All recent purchases and sales on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedTransactions.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  No transactions to display
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Item</th>
                        <th className="text-left py-3 px-2">Price</th>
                        <th className="text-left py-3 px-2">Buyer</th>
                        <th className="text-left py-3 px-2">Seller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map(transaction => {
                        const item = items.find(i => i.id === transaction.itemId);
                        const isBuyer = transaction.buyerId === currentUser?.id;
                        const isSeller = transaction.sellerId === currentUser?.id;
                        
                        return (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2 text-sm">
                              {format(new Date(transaction.date), 'PPP')}
                            </td>
                            <td className="py-3 px-2">
                              {transaction.itemName}
                            </td>
                            <td className="py-3 px-2 font-medium">
                              ${transaction.price.toFixed(2)}
                            </td>
                            <td className={`py-3 px-2 ${isBuyer ? 'font-semibold text-marketplace-primary' : ''}`}>
                              {isBuyer ? 'You' : `User #${transaction.buyerId}`}
                            </td>
                            <td className={`py-3 px-2 ${isSeller ? 'font-semibold text-marketplace-primary' : ''}`}>
                              {isSeller ? 'You' : `User #${transaction.sellerId}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Reports;
