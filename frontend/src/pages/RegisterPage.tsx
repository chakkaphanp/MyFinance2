import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({ email, name, password });
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay-light to-clay-white flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-clay-white to-clay-light rounded p-8 w-full max-w-md" style={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(255, 159, 90, 0.15)' }}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-clay-primary to-clay-secondary rounded flex items-center justify-center text-white font-bold mx-auto" style={{ borderRadius: '20px' }}>
            MF
          </div>
          <h1 className="text-3xl font-bold text-clay-dark mt-4">Create Account</h1>
          <p className="text-clay-dark opacity-60 mt-2">Start managing your finances</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-gradient-to-r from-clay-coral to-clay-pink text-white p-3 rounded text-sm" style={{ borderRadius: '20px' }}>{error}</div>}

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-clay-dark opacity-70">
            Already have an account?{' '}
            <Link to="/login" className="text-clay-primary font-medium hover:text-clay-secondary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
