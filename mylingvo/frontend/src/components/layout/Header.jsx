import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
            style={{ background: 'var(--primary)', borderBottom: '2px solid var(--primary-light)' }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden text-white text-2xl">☰</button>
        <Link to="/" className="text-xl font-bold text-white tracking-wide">MyLingvo</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link to="/progress" className="text-white/80 hover:text-white text-sm">
              ⭐ {user.progress?.xp || 0} XP
            </Link>
            <Link to="/profile" className="text-white/80 hover:text-white text-sm">
              {user.name}
            </Link>
            <button onClick={logout} className="text-white/60 hover:text-white text-sm">
              Чиқиш
            </button>
          </>
        )}
      </div>
    </header>
  );
}
