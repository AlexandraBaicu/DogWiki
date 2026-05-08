import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PawPrint, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="logo-container">
            <PawPrint className="logo-icon" size={48} />
          </div>
          <h2>{isLogin ? 'Bine ai revenit!' : 'Creează un cont nou'}</h2>
          <p>Descoperă lumea fascinantă a câinilor.</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Adresa de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button disabled={loading} type="submit" className="primary-button">
            {loading ? 'Se încarcă...' : isLogin ? 'Autentificare' : 'Înregistrare'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Nu ai un cont?' : 'Ai deja un cont?'}
            <button 
              className="text-button" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Înregistrează-te' : 'Loghează-te'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
