import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdminUsers } from '../../api/admin';
import { getLevelFromXp, formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', page, search],
    queryFn: () =>
      getAdminUsers({ page, search, per_page: 15 }).then((r) => r.data?.data || r.data),
  });

  const users = data?.data || data?.users || [];
  const meta = data?.meta || {};
  const lastPage = meta.last_page || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Админ
            </Link>
            <span style={{ color: 'var(--text-secondary)' }}>/</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Фойдаланувчилар
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Фойдаланувчилар
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Исм ёки email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none text-white text-sm w-64"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ background: 'var(--primary)' }}
          >
            Қидириш
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}
        >
          {error.message}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {isLoading ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            Юкланмоқда...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            Фойдаланувчи топилмади
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th
                    className="text-left px-5 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Исм
                  </th>
                  <th
                    className="text-left px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Email
                  </th>
                  <th
                    className="text-center px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    XP
                  </th>
                  <th
                    className="text-center px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Даража
                  </th>
                  <th
                    className="text-center px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Охирги кириш
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.name}
                      </span>
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </td>
                    <td
                      className="text-center px-3 py-3 font-medium"
                      style={{ color: 'var(--warning)' }}
                    >
                      {user.progress?.xp || user.xp || 0}
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: 'var(--primary)',
                          color: 'white',
                        }}
                      >
                        {getLevelFromXp(user.progress?.xp || user.xp || 0)}
                      </span>
                    </td>
                    <td
                      className="text-center px-3 py-3 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {user.last_login_at
                        ? formatDate(user.last_login_at)
                        : user.updated_at
                          ? formatDate(user.updated_at)
                          : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm cursor-pointer disabled:opacity-30 disabled:cursor-default"
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            &larr; Олдинги
          </button>

          <span className="text-sm px-3" style={{ color: 'var(--text-secondary)' }}>
            {page} / {lastPage}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="px-3 py-1.5 rounded-lg text-sm cursor-pointer disabled:opacity-30 disabled:cursor-default"
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Кейинги &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
