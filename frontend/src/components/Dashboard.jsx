import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { backendAPI } from '../services/backend-connector';

const Dashboard = ({ user, urls, onUrlsChange }) => {
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchUserUrls = async () => {
      if (!user) return;
      setLoading(true);
      try {
        /**
         * BACKEND CONNECTION POINT - GET USER URLS
         * Fetches URLs created by the authenticated user.
         */
        const data = await backendAPI.getUserUrls(user.email);
        onUrlsChange(data);
      } catch (err) {
        console.error('Error fetching URLs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserUrls();
  }, [user]);

  const handleCopy = async (id, shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL?')) return;
    try {
      /**
       * BACKEND CONNECTION POINT - DELETE URL
       * Deletes a short URL by its unique ID.
       */
      await backendAPI.deleteURL(id);
      onUrlsChange(urls.filter((url) => url.id !== id));
    } catch (err) {
      alert('Failed to delete URL: ' + err.message);
    }
  };

  const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0);

  // Top 5 URLs for custom responsive bar chart visualization
  const topUrls = [...urls]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .filter((u) => u.clicks > 0);

  const maxClicks = topUrls.length > 0 ? topUrls[0].clicks : 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Dashboard</h2>
        <p className={styles.subtitle}>Track click trends and manage shortened links.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{urls.length}</span>
            <span className={styles.statLabel}>Total Links</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalClicks}</span>
            <span className={styles.statLabel}>Total Clicks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Redirection Rate</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        <div>
          <h3 className={styles.sectionTitle}>Shortened URLs History</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className={styles.spinner} style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading links...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className={styles.noData}>
              No URLs shortened yet. Go to Home to shorten your first link!
            </div>
          ) : (
            <div className={styles.urlList}>
              {urls.map((item) => (
                <div key={item.id} className={styles.urlCard}>
                  <div className={styles.urlHeader}>
                    <div className={styles.urls}>
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.shortUrl}
                      >
                        /{item.alias}
                      </a>
                      <span className={styles.longUrl} title={item.originalUrl}>
                        {item.originalUrl}
                      </span>
                    </div>
                    <span className={styles.clicksBadge}>{item.clicks} Clicks</span>
                  </div>

                  <div className={styles.urlFooter}>
                    <span className={styles.date}>
                      Created {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleCopy(item.id, item.shortUrl)}
                      >
                        {copiedId === item.id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Link Analytics Breakdown</h3>
          <div className={styles.chartCard}>
            <span className={styles.statLabel} style={{ fontWeight: 600 }}>Top Performing Links</span>
            <div className={styles.chartContainer}>
              {topUrls.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '1rem 0' }}>
                  No click data available yet. Click your short links to view analytics!
                </p>
              ) : (
                <div className={styles.chartBarGroup}>
                  {topUrls.map((item) => {
                    const widthPercent = Math.max((item.clicks / maxClicks) * 100, 8);
                    return (
                      <div key={item.id} className={styles.barRow}>
                        <div className={styles.barLabel}>
                          <span>/{item.alias}</span>
                          <strong>{item.clicks} clicks</strong>
                        </div>
                        <div className={styles.barOuter}>
                          <div
                            className={styles.barInner}
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
