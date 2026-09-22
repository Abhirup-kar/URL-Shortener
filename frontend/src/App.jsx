import { useState, useEffect } from 'react';
import Nav from './components/nav';
import UrlForm from './components/UrlForm';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { backendAPI } from './services/backend-connector';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState('login');

  // Load user session on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('user_session');
    if (cachedUser && cachedUser !== 'undefined') {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (err) {
        console.error("Failed to parse cached session:", err);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  // Fetch URLs from database whenever user session changes
  useEffect(() => {
    const loadUrls = async () => {
      if (user) {
        try {
          const data = await backendAPI.getUserUrls(user.email);
          setUrls(data);
        } catch (err) {
          console.error("Failed to load URLs from database:", err);
        }
      } else {
        setUrls([]);
      }
    };
    loadUrls();
  }, [user]);

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('user_session', JSON.stringify(authenticatedUser));
    setActiveTab('dashboard'); // Redirect to dashboard on login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    setActiveTab('home');
  };

  const handleOpenAuth = (initialView) => {
    setAuthInitialView(initialView);
    setAuthModalOpen(true);
  };

  const handleNewShortUrl = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  return (
    <>
      <Nav
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container-fluid" style={{ minHeight: '85vh', paddingBottom: '3rem' }}>
        {activeTab === 'home' ? (
          <UrlForm user={user} onNewShortUrl={handleNewShortUrl} />
        ) : (
          <Dashboard user={user} urls={urls} onUrlsChange={setUrls} />
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authInitialView}
        onAuthSuccess={handleLogin}
      />

      <footer style={{
        textAlign: 'center', 
        padding: '2rem 1.5rem', 
        fontSize: '0.85rem', 
        color: 'var(--text-secondary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(5, 5, 12, 0.4)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span>&copy; {new Date().getFullYear()} Shorten.it. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>API Docs</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
