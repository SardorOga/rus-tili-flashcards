import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Бош саҳифа', icon: '🏠' },
  { to: '/words', label: 'Сўзлар', icon: '📚' },
  { to: '/sentences', label: 'Гаплар', icon: '💬' },
  { to: '/grammar', label: 'Грамматика', icon: '📖' },
  { to: '/verbs', label: 'Феъллар', icon: '🔄' },
  { to: '/exercises', label: 'Машқлар', icon: '🎓' },
  { to: '/progress', label: 'Прогресс', icon: '📊' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-64 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-56 p-4 flex flex-col gap-1`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={onClose} className="text-white text-xl">✕</button>
        </div>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
              ${isActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
            style={({ isActive }) => isActive ? { background: 'var(--primary)', color: 'white' } : {}}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </aside>
    </>
  );
}
