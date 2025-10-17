import { useState, useEffect } from 'react'
import './App.css'

interface Achievement {
  id?: number;
  title: string;
  type: string;
  description?: string;
}

interface Resume {
  id: number;
  title: string;
  content: any;
  created_at: string;
}

const API_URL = '/api';

export default function App() {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [achievements] = useState<Achievement[]>([
    { title: 'Software Engineering Internship at Tech Corp', type: 'internship' },
    { title: 'First Place - National Hackathon 2024', type: 'hackathon' },
    { title: 'Full Stack Development Course - Certified', type: 'course' }
  ]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchResumes();
    }
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { email, password, name };
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Authentication failed');
        return;
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error('Failed to fetch resumes');
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/generate-summary`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ achievements })
      });
      const json = await res.json();
      setSummary(json.summary || 'No summary generated');
    } catch (err) {
      setSummary('Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setResumes([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="auth-container">
          <h1>Resume System</h1>
          <p className="subtitle">Professional Resume Builder with AI</p>
          
          <form onSubmit={handleAuth} className="auth-form">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
            </button>
            
            <p className="toggle-auth">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Resume System</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <main>
        <section className="section">
          <h2>AI Summary Generator</h2>
          <p>Generate a professional summary based on your achievements</p>
          
          <div className="achievements-list">
            <h3>Your Achievements:</h3>
            {achievements.map((ach, idx) => (
              <div key={idx} className="achievement-item">
                <span className="badge">{ach.type}</span>
                <span>{ach.title}</span>
              </div>
            ))}
          </div>
          
          <button onClick={generateSummary} disabled={loading} className="primary-btn">
            {loading ? 'Generating...' : 'Generate AI Summary'}
          </button>
          
          {summary && (
            <div className="summary-result">
              <h3>Generated Summary:</h3>
              <p>{summary}</p>
            </div>
          )}
        </section>

        <section className="section">
          <h2>Your Resumes</h2>
          {resumes.length === 0 ? (
            <p className="empty-state">No resumes yet. Create your first resume to get started!</p>
          ) : (
            <div className="resume-list">
              {resumes.map((resume) => (
                <div key={resume.id} className="resume-card">
                  <h3>{resume.title}</h3>
                  <p className="date">Created: {new Date(resume.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

