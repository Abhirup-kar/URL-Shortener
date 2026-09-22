import { useState } from 'react';
import styles from './nav.module.css';

const Nav = ({ user, onLogout, onOpenAuth, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <a className={styles.logo} href="#" onClick={() => handleLinkClick('home')}>
          <svg
            className={styles.logoIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
          Shorten.it
        </a>

        <button className={styles.toggleBtn} onClick={toggleMenu} aria-label="Toggle navigation">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`${styles.navMenu} ${isOpen ? styles.navMenuOpen : ''}`}>
          <a
            className={`${styles.navLink} ${activeTab === 'home' ? styles.navLinkActive : ''}`}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </a>
          {user && (
            <a
              className={`${styles.navLink} ${activeTab === 'dashboard' ? styles.navLinkActive : ''}`}
              onClick={() => handleLinkClick('dashboard')}
            >
              Dashboard
            </a>
          )}

          {user ? (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user.username || user.email}</span>
              <button className={styles.logoutBtn} onClick={() => { onLogout(); setIsOpen(false); }}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button className={styles.loginBtn} onClick={() => { onOpenAuth('login'); setIsOpen(false); }}>
                Sign In
              </button>
              <button className={styles.signupBtn} onClick={() => { onOpenAuth('signup'); setIsOpen(false); }}>
                Get Started
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Nav;