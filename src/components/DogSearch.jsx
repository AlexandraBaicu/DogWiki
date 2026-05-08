import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, LogOut, Dices, Clock, Heart, Volume2, SquareSquare } from 'lucide-react';
import { fetchDogImage, fetchDogFact } from '../services/api';
import { useAuth } from '../context/AuthContext';

const recommendedBreeds = ['husky', 'pug', 'beagle', 'labrador', 'bulldog', 'corgi', 'poodle', 'chihuahua', 'boxer', 'dalmatian'];

const DogSearch = () => {
  const [breed, setBreed] = useState('');
  const [dogImage, setDogImage] = useState('');
  const [dogFact, setDogFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { currentUser, logout } = useAuth();

  // Încărcăm istoricul și favoritele din localStorage la montare
  useEffect(() => {
    if (currentUser) {
      const savedHistory = localStorage.getItem(`dog_history_${currentUser.email}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedFavorites = localStorage.getItem(`dog_favorites_${currentUser.email}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [currentUser]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setDogImage('');
    setDogFact('');
    setBreed(searchTerm);
    
    // Oprim orice voce care citea inainte
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const [imageUrl, fact] = await Promise.all([
        fetchDogImage(searchTerm),
        fetchDogFact(searchTerm)
      ]);
      
      setDogImage(imageUrl);
      setDogFact(fact);

      // Salvăm în istoric
      const updatedHistory = [searchTerm.toLowerCase(), ...history.filter(h => h !== searchTerm.toLowerCase())].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem(`dog_history_${currentUser.email}`, JSON.stringify(updatedHistory));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(breed);
  };

  const handleSurprise = () => {
    const randomBreed = recommendedBreeds[Math.floor(Math.random() * recommendedBreeds.length)];
    performSearch(randomBreed);
  };

  const toggleFavorite = () => {
    const currentBreed = breed.toLowerCase();
    let updatedFavorites;
    
    if (favorites.includes(currentBreed)) {
      updatedFavorites = favorites.filter(f => f !== currentBreed);
    } else {
      if (favorites.length >= 3) {
        alert('Poți avea maxim 3 rase favorite în topul tău! Elimină una mai întâi.');
        return;
      }
      updatedFavorites = [...favorites, currentBreed];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem(`dog_favorites_${currentUser.email}`, JSON.stringify(updatedFavorites));
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browserul tău nu suportă redarea audio.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(dogFact);
      utterance.lang = 'ro-RO';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Cleanup la demontare
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <div className="avatar">
            {currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="user-email">{currentUser?.email}</span>
        </div>
        <button onClick={logout} className="logout-button">
          <LogOut size={18} />
          <span>Ieși din cont</span>
        </button>
      </header>

      <main className="dashboard-main">
        <div className="search-section glass-panel">
          <h1 className="title">DoggWiki 🐾</h1>
          <p className="subtitle">Caută o rasă de câine și află ceva interesant despre ea!</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Ex: husky, pug, beagle..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" disabled={loading} className="primary-button search-button">
              {loading ? <Loader2 className="spinner" size={20} /> : 'Caută'}
            </button>
            <button type="button" disabled={loading} onClick={handleSurprise} className="primary-button search-button" style={{ background: '#ec4899', width: 'auto', padding: '0 20px' }} title="Surprinde-mă cu o rasă aleatorie!">
              <Dices size={20} />
            </button>
          </form>

          <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Rase recomandate cu informații complete: <b>Husky, Pug, Beagle, Labrador, Bulldog, Corgi, Poodle, Chihuahua, Boxer, Dalmatian.</b>
          </p>

          {favorites.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Heart size={16} color="#ef4444" fill="#ef4444" />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>Top {favorites.length}/3 Favorite:</span>
              {favorites.map(item => (
                <span 
                  key={item} 
                  onClick={() => performSearch(item)}
                  style={{ cursor: 'pointer', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', fontSize: '13px', textTransform: 'capitalize', color: '#fca5a5', fontWeight: 'bold' }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Clock size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Ultimele căutări:</span>
              {history.map(item => (
                <span 
                  key={item} 
                  onClick={() => performSearch(item)}
                  style={{ cursor: 'pointer', padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', textTransform: 'capitalize' }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {(dogImage || loading) && (
          <div className="results-section">
            <div className="image-card glass-panel">
              {loading ? (
                <div className="skeleton-image">
                  <Loader2 className="spinner large" size={32} />
                </div>
              ) : (
                <img 
                  src={dogImage} 
                  alt={`A cute ${breed}`} 
                  className="dog-image" 
                />
              )}
            </div>

            <div className="fact-card glass-panel">
              <div className="fact-header" style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles className="sparkles-icon" size={20} />
                  <h3 style={{ textTransform: 'capitalize' }}>{breed || 'Informații Rasă'}</h3>
                </div>
                {!loading && breed && (
                  <button 
                    onClick={toggleFavorite}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title={favorites.includes(breed.toLowerCase()) ? "Elimină din favorite" : "Adaugă în top 3 favorite"}
                  >
                    <Heart 
                      size={24} 
                      color={favorites.includes(breed.toLowerCase()) ? "#ef4444" : "var(--text-secondary)"} 
                      fill={favorites.includes(breed.toLowerCase()) ? "#ef4444" : "none"} 
                    />
                  </button>
                )}
              </div>
              {loading ? (
                <div className="skeleton-text">
                  <div className="line"></div>
                  <div className="line short"></div>
                </div>
              ) : (
                <div>
                  <p className="fact-text">{dogFact}</p>
                  
                  <button 
                    onClick={handleSpeak}
                    className="primary-button"
                    style={{ 
                      marginTop: '15px', 
                      background: isSpeaking ? '#ef4444' : '#8b5cf6', 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <Volume2 size={18} />
                    {isSpeaking ? 'Oprește Citirea' : 'Citește cu voce tare'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DogSearch;
