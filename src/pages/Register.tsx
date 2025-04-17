
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { Check, X } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    return password.length >= 8;
  };

  const passwordsMatch = () => {
    return password === confirmPassword && password !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    if (!passwordsMatch()) {
      return;
    }
    
    await register(username, email, password);
    navigate('/dashboard');
  };

  return (
    <MainLayout hideSearch>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-sm flex items-center mt-1">
                  {validatePassword() ? (
                    <Check className="text-green-500 w-4 h-4 mr-1" />
                  ) : (
                    <X className="text-red-500 w-4 h-4 mr-1" />
                  )}
                  <span className={validatePassword() ? "text-green-500" : "text-red-500"}>
                    Password must be at least 8 characters
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && (
                  <div className="text-sm flex items-center mt-1">
                    {passwordsMatch() ? (
                      <Check className="text-green-500 w-4 h-4 mr-1" />
                    ) : (
                      <X className="text-red-500 w-4 h-4 mr-1" />
                    )}
                    <span className={passwordsMatch() ? "text-green-500" : "text-red-500"}>
                      Passwords {passwordsMatch() ? "match" : "do not match"}
                    </span>
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !validatePassword() || !passwordsMatch()}
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-marketplace-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;
