import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for Admin Dashboard
const AdminDashboardContext = createContext();

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider');
  }
  return context;
};

export const AdminDashboardProvider = ({ children }) => {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_ADMIN_API_URL || '/sys-admin-secure-panel/api';

  // Initialize CSRF Token
  useEffect(() => {
    if (isAuthenticated) {
      generateCSRFToken();
    }
  }, [isAuthenticated]);

  const generateCSRFToken = () => {
    const token = generateSecureToken();
    sessionStorage.setItem('csrf_token', token);
    setCsrfToken(token);
  };

  const generateSecureToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const login = (key) => {
    setAdminKey(key);
    localStorage.setItem('admin_key', key);
    setIsAuthenticated(true);
    setError(null);
  };

  const logout = () => {
    setAdminKey('');
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    sessionStorage.removeItem('csrf_token');
  };

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'x-csrf-token': csrfToken,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    adminKey,
    isAuthenticated,
    loading,
    error,
    csrfToken,
    login,
    logout,
    apiCall,
    API_BASE_URL,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

// ============= LOGIN COMPONENT =============

export const AdminLoginPage = () => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { login, error } = useAdminDashboard();

  const handleLogin = (e) => {
    e.preventDefault();
    if (key.trim()) {
      login(key);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Secure Access Only</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-key">Admin Key</label>
              <div className="input-group">
                <input
                  id="admin-key"
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your admin key"
                  className="form-input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="btn-toggle-visibility"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Access Dashboard
            </button>
          </form>

          <div className="security-notice">
            <p>🔒 This is a secure admin panel.</p>
            <p>Your access is logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= DASHBOARD LAYOUT =============

export const AdminDashboardLayout = ({ children }) => {
  const { logout, adminKey } = useAdminDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <button
            className="btn-collapse"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavItem icon="📊" label="Overview" onClick={() => setCurrentPage('overview')} />
          <NavItem icon="📝" label="Posts" onClick={() => setCurrentPage('posts')} />
          <NavItem icon="🖼️" label="Media" onClick={() => setCurrentPage('media')} />
          <NavItem icon="👥" label="Users" onClick={() => setCurrentPage('users')} />
          <NavItem icon="📋" label="Activity Logs" onClick={() => setCurrentPage('logs')} />
          <NavItem icon="⚙️" label="Settings" onClick={() => setCurrentPage('settings')} />
          <NavItem icon="💾" label="Backups" onClick={() => setCurrentPage('backups')} />
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <span className="key-status">Key: {adminKey.substring(0, 8)}...</span>
            <span className="timestamp">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <button className="nav-item" onClick={onClick}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </button>
);

// ============= OVERVIEW PAGE =============

export const OverviewPage = () => {
  const { apiCall, loading, error } = useAdminDashboard();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const data = await apiCall('/overview?days=7');
      setOverview(data.data);
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!overview) return <div>No data available</div>;

  return (
    <div className="overview-page">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <StatCard
          title="Total Actions"
          value={overview.failureRate?.total || 0}
          icon="📊"
        />
        <StatCard
          title="Success Rate"
          value={`${overview.failureRate?.successRate?.toFixed(2) || 0}%`}
          icon="✅"
        />
        <StatCard
          title="Failed Actions"
          value={overview.failureRate?.failed || 0}
          icon="❌"
        />
        <StatCard
          title="Top Admins"
          value={overview.topAdmins?.length || 0}
          icon="👥"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Action Statistics</h3>
          <ActionStatsChart stats={overview.stats} />
        </div>

        <div className="chart-container">
          <h3>Activity Timeline</h3>
          <TimelineChart timeline={overview.timeline} />
        </div>
      </div>

      <div className="admin-activity">
        <h3>Top Active Admins</h3>
        <AdminActivityTable admins={overview.topAdmins} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const ActionStatsChart = ({ stats }) => (
  <div className="stats-list">
    {stats?.map((stat) => (
      <div key={stat._id} className="stat-row">
        <span className="action-type">{stat._id}</span>
        <span className="action-count">{stat.count}</span>
        <span className="success-rate">
          {`${((stat.successCount / stat.count) * 100).toFixed(0)}%`}
        </span>
      </div>
    ))}
  </div>
);

const TimelineChart = ({ timeline }) => (
  <div className="timeline">
    {timeline?.map((item) => (
      <div key={item._id} className="timeline-item">
        <span className="date">{item._id}</span>
        <span className="count">{item.count} actions</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(item.count / Math.max(...timeline.map(t => t.count))) * 100}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

const AdminActivityTable = ({ admins }) => (
  <table className="activity-table">
    <thead>
      <tr>
        <th>Admin Name</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {admins?.map((admin) => (
        <tr key={admin._id}>
          <td>{admin.admin?.name || 'Unknown'}</td>
          <td>{admin.admin?.email || '-'}</td>
          <td>{admin.actions}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ============= POSTS PAGE =============

export const PostsPage = () => {
  const { apiCall, loading, error } = useAdminDashboard();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const data = await apiCall(`/posts?page=${page}&limit=20`);
      setPosts(data.data.posts);
      setTotal(data.data.pagination.total);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/posts/${postId}`, { method: 'DELETE' });
        fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="posts-page">
      <div className="page-header">
        <h2>Posts Manager</h2>
        <button className="btn btn-primary">+ New Post</button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td><span className={`badge badge-${post.status.toLowerCase()}`}>{post.status}</span></td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-info">Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deletePost(post._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminDashboardProvider;
