import { useState } from 'react';
import styles from './UrlForm.module.css';
import { backendAPI } from '../services/backend-connector';

const UrlForm = ({ user, onNewShortUrl }) => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      /**
       * BACKEND CONNECTION POINT - SHORTEN URL
       * Passes the original URL, alias, and the logged-in user email (if any)
       */
      const data = await backendAPI.shortenURL(url, alias, user ? user.email : null);
      setResult(data);
      setUrl('');
      setAlias('');
      if (onNewShortUrl) {
        onNewShortUrl(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to shorten link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      /**
       * OPTIONAL BACKEND TRACKING CONNECTION
       * Simulates user visiting the URL.
       */
      await backendAPI.trackClick(result.alias);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Shorten your links, <br /><span style={{ color: '#818cf8' }}>expand your reach</span></h1>
        <p className={styles.subtitle}>
          Create clean, memorable links in seconds. Join to track click counts, manage redirects, and use custom aliases.
        </p>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Long Destination URL</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <input
                type="url"
                className={styles.input}
                placeholder="https://example.com/very/long/path/to/something/important"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="button"
            className={styles.advancedToggle}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '− Hide Custom Settings' : '＋ Add Custom Alias'}
          </button>

          {showAdvanced && (
            <div className={styles.advancedFields}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Custom Alias (Optional)</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="my-awesome-link"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Shortening Link...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {error && (
          <div className={styles.error} style={{ marginTop: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <span className={styles.resultTitle}>URL Successfully Shortened!</span>
              <span className={styles.originalUrl} title={result.originalUrl}>
                {result.originalUrl}
              </span>
            </div>
            
            <div className={styles.resultLinkGroup}>
              <input
                type="text"
                className={styles.shortUrlInput}
                readOnly
                value={result.shortUrl}
              />
              <button 
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className={styles.qrContainer}>
              <div className={styles.qrPlaceholder}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(result.shortUrl)}&color=0a0a16`} 
                  alt="QR Code" 
                  width="78"
                  height="78"
                  style={{ display: 'block' }}
                />
              </div>
              <div className={styles.qrText}>
                <span className={styles.qrLabel}>Download QR Code</span>
                <span className={styles.qrSub}>Scan to access target URL on mobile devices</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
