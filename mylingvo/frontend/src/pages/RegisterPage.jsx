import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(s => s.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Паролларнинг мослиги йўқ');
      return;
    }

    if (password.length < 8) {
      setError('Парол камида 8 та белгидан иборат бўлиши керак');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(data?.message || 'Хатолик юз берди');
      }
    }
    setLoading(false);
  };

  const handleSocial = (provider) => {
    window.location.href = `/api/v1/auth/social/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-dark)' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: 'var(--bg-card)' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--primary-light)' }}>MyLingvo</h1>
        <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>Янги аккаунт яратинг</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Исмингиз"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg outline-none text-white"
            style={{ background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg outline-none text-white"
            style={{ background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <input
            type="password"
            placeholder="Парол"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-lg outline-none text-white"
            style={{ background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <input
            type="password"
            placeholder="Паролни тасдиқланг"
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-lg outline-none text-white"
            style={{ background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50 cursor-pointer"
            style={{ background: 'var(--primary)' }}
          >
            {loading ? 'Рўйхатдан ўтилмоқда...' : 'Рўйхатдан ўтиш'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>ёки</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSocial('google')}
            className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: '#4285f4' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google орқали кириш
          </button>
          <button
            onClick={() => handleSocial('facebook')}
            className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: '#1877f2' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook орқали кириш
          </button>
          <button
            onClick={() => handleSocial('telegram')}
            className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: '#0088cc' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram орқали кириш
          </button>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Аккаунтингиз борми?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--primary-light)' }}>
            Кириш
          </Link>
        </p>
      </div>
    </div>
  );
}
