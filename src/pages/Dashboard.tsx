
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, DollarSign, Package, ShoppingCart, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, depositCash } = useAuth();
  const { userItems, purchasedItems, removeItem } = useMarketplace();
  
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleDeposit = () => {
    if (depositAmount > 0) {
      depositCash(depositAmount);
      setDepositAmount(0);
      setOpenDepositDialog(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeItem(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser.username}!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={openDepositDialog} onOpenChange={setOpenDepositDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Deposit Cash
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Deposit Cash</DialogTitle>
                  <DialogDescription>
                    Add funds to your account to purchase items.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="any"
                        className="pl-8"
                        value={depositAmount || ''}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleDeposit} disabled={depositAmount <= 0}>
                    Deposit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={() => navigate('/sell')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Sell an Item
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentUser.cashBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available for purchases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items for Sale</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userItems.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active listings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchased Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasedItems.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items you bought
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="selling">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selling">
              <Package className="mr-2 h-4 w-4" />
              Items You're Selling
            </TabsTrigger>
            <TabsTrigger value="purchased">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchased Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selling" className="space-y-4 mt-4">
            {userItems.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Items Listed</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't listed any items for sale yet.
                    </p>
                    <Button onClick={() => navigate('/sell')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      List an Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {userItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-marketplace-primary font-medium mb-2">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/item/${item.id}`)}>
                          View Details
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
                          Remove Listing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchased" className="space-y-4 mt-4">
            {purchasedItems.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Purchases Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't purchased any items yet.
                    </p>
                    <Button onClick={() => navigate('/browse')}>
                      Browse Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {purchasedItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-marketplace-primary font-medium mb-2">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-gray-500">Purchased from: {item.sellerName}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
