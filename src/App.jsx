import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import DogSearch from './components/DogSearch';

const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <div className="app-wrapper">
      {currentUser ? <DogSearch /> : <Login />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
