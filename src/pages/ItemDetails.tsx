
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById, purchaseItem } = useMarketplace();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState<ReturnType<typeof getItemById>>(undefined);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundItem = getItemById(id);
      setItem(foundItem);
      
      if (!foundItem) {
        // Item not found
        setTimeout(() => navigate('/browse'), 3000);
      }
    }
  }, [id, getItemById, navigate]);

  if (!item) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <p className="text-gray-600 mb-6">
            Redirecting you to browse page...
          </p>
          <Button onClick={() => navigate('/browse')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isOwner = currentUser?.id === item.sellerId;
  const canPurchase = isAuthenticated && !isOwner && item.isAvailable;
  const hasEnoughBalance = currentUser && currentUser.cashBalance >= item.price;

  const handlePurchase = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isOwner) {
      return;
    }
    
    if (!hasEnoughBalance) {
      return;
    }
    
    setIsPurchasing(true);
    purchaseItem(item.id);
    setTimeout(() => {
      setIsPurchasing(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Item Image */}
        <div className="md:col-span-2">
          {item.image ? (
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          ) : (
            <div className="rounded-lg border bg-gray-100 flex items-center justify-center h-[300px]">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{item.name}</CardTitle>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className="text-2xl font-bold text-marketplace-primary">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  <span>Seller: {item.sellerName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Listed: {format(new Date(item.createdAt), 'PPP')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Status: {item.isAvailable ? 'Available' : 'Sold'}</span>
                </div>
              </div>

              {!item.isAvailable && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    This item has already been sold.
                  </AlertDescription>
                </Alert>
              )}

              {isOwner && (
                <Alert className="mt-4">
                  <AlertDescription>
                    This is your item listing.
                  </AlertDescription>
                </Alert>
              )}

              {canPurchase && !hasEnoughBalance && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    You don't have enough balance to purchase this item.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              {canPurchase ? (
                <Button 
                  className="w-full" 
                  onClick={handlePurchase}
                  disabled={isPurchasing || !hasEnoughBalance}
                >
                  {isPurchasing ? 'Processing...' : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {hasEnoughBalance ? 'Buy Now' : 'Insufficient Funds'}
                    </>
                  )}
                </Button>
              ) : isOwner ? (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Manage in Dashboard
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  disabled
                >
                  {!isAuthenticated ? 'Login to Purchase' : 'No Longer Available'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ItemDetails;
