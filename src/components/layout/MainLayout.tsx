
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Package, BarChart3, LogOut, User, LogIn, UserPlus, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/context/MarketplaceContext';

interface MainLayoutProps {
  children: React.ReactNode;
  hideSearch?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideSearch = false }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useMarketplace();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-marketplace-background flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-marketplace-primary flex items-center">
              <ShoppingCart className="mr-2" />
              MarketPlace
            </Link>
          </div>

          {!hideSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Search for items..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          )}

          <nav className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home size={18} className="mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/browse">
                  <Button variant="ghost" size="sm">
                    <Package size={18} className="mr-1" />
                    <span className="hidden sm:inline">Browse</span>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User size={18} className="mr-1" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="ghost" size="sm">
                    <BarChart3 size={18} className="mr-1" />
                    <span className="hidden sm:inline">Reports</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={18} className="mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                {currentUser && (
                  <div className="hidden md:flex items-center ml-4 text-sm">
                    <span className="text-gray-600 mr-1">Balance:</span>
                    <span className="font-semibold">${currentUser.cashBalance.toFixed(2)}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn size={18} className="mr-1" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    <UserPlus size={18} className="mr-1" />
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">MarketPlace</h3>
              <p className="text-gray-600 text-sm">
                A distributed online marketplace system for buying and selling items.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-marketplace-primary hover:underline">Home</Link></li>
                <li><Link to="/browse" className="text-marketplace-primary hover:underline">Browse Items</Link></li>
                <li><Link to="/dashboard" className="text-marketplace-primary hover:underline">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Contact</h3>
              <p className="text-gray-600 text-sm">
                For support, please contact us at support@marketplace.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} MarketPlace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
