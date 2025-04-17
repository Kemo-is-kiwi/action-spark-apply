
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, UserPlus, Search, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-marketplace-primary/10 to-marketplace-secondary/10 rounded-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Buy and Sell with Ease
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Join our online marketplace and discover a world of unique items or sell your own products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Button size="lg" onClick={() => navigate('/browse')}>
                  <Search className="mr-2 h-5 w-5" />
                  Browse Items
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/sell')}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Sell an Item
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up Now
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Login to Account
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Our platform makes buying and selling simple and secure.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-marketplace-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-marketplace-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up in seconds and start exploring our marketplace.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-marketplace-secondary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-marketplace-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List or Buy Items</h3>
              <p className="text-gray-600">
                Easily list your items for sale or browse and purchase from others.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-marketplace-accent/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-marketplace-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Our secure system handles the payment and transfer of items.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Requirements Section */}
      <div className="mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b6868646-6ec4-41b7-b780-83af7d206cc3.png" 
                alt="Project Requirements" 
                className="w-full max-w-3xl rounded-lg border"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-marketplace-secondary/20 to-marketplace-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Join thousands of users already buying and selling on our platform.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
        </Button>
      </div>
    </MainLayout>
  );
};

export default Index;
