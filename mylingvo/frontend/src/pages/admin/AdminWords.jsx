import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdminWords, createAdminWord, updateAdminWord, deleteAdminWord } from '../../api/admin';
import { CASE_NAMES, GENDERS } from '../../utils/helpers';

const EMPTY_FORM = {
  word: '',
  word_uz: '',
  gender: 'м',
  sklonenie: '1',
  imenitelnyy: '',
  roditelnyy: '',
  datelnyy: '',
  vinitelnyy: '',
  tvoritelnyy: '',
  predlozhnyy: '',
};

const CASE_KEYS = [
  'imenitelnyy',
  'roditelnyy',
  'datelnyy',
  'vinitelnyy',
  'tvoritelnyy',
  'predlozhnyy',
];

export default function AdminWords() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'words', page],
    queryFn: () => getAdminWords({ page, per_page: 15 }).then((r) => r.data?.data || r.data),
  });

  const words = data?.data || data?.words || [];
  const meta = data?.meta || {};
  const lastPage = meta.last_page || 1;

  const createMutation = useMutation({
    mutationFn: (wordData) => createAdminWord(wordData).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      resetForm();
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || 'Хатолик юз берди');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: wordData }) => updateAdminWord(id, wordData).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      resetForm();
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || 'Хатолик юз берди');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminWord(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
  });

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleEdit = (word) => {
    setForm({
      word: word.word || '',
      word_uz: word.word_uz || '',
      gender: word.gender || 'м',
      sklonenie: word.sklonenie || '1',
      imenitelnyy: word.imenitelnyy || '',
      roditelnyy: word.roditelnyy || '',
      datelnyy: word.datelnyy || '',
      vinitelnyy: word.vinitelnyy || '',
      tvoritelnyy: word.tvoritelnyy || '',
      predlozhnyy: word.predlozhnyy || '',
    });
    setEditingId(word.id);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = (word) => {
    if (window.confirm(`"${word.word}" сўзини ўчирмоқчимисиз?`)) {
      deleteMutation.mutate(word.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.word.trim()) {
      setFormError('Сўзни киритинг');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Админ
            </Link>
            <span style={{ color: 'var(--text-secondary)' }}>/</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Сўзлар
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Машқ сўзлари
          </h1>
        </div>

        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ background: showForm ? 'var(--error)' : 'var(--primary)' }}
        >
          {showForm ? 'Бекор қилиш' : 'Янги сўз қўшиш'}
        </button>
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

      {/* Add/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {editingId ? 'Сўзни таҳрирлаш' : 'Янги сўз қўшиш'}
          </h3>

          {formError && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}
            >
              {formError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Word */}
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Сўз (рус)
              </label>
              <input
                type="text"
                value={form.word}
                onChange={(e) => handleChange('word', e.target.value)}
                placeholder="книга"
                className="px-3 py-2 rounded-lg outline-none text-white text-sm"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Word UZ */}
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Сўз (ўзбекча)
              </label>
              <input
                type="text"
                value={form.word_uz}
                onChange={(e) => handleChange('word_uz', e.target.value)}
                placeholder="китоб"
                className="px-3 py-2 rounded-lg outline-none text-white text-sm"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Жинс
              </label>
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="px-3 py-2 rounded-lg outline-none text-white text-sm cursor-pointer"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {Object.entries(GENDERS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {key} - {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sklonenie */}
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Склонение
              </label>
              <select
                value={form.sklonenie}
                onChange={(e) => handleChange('sklonenie', e.target.value)}
                className="px-3 py-2 rounded-lg outline-none text-white text-sm cursor-pointer"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <option value="1">1-склонение</option>
                <option value="2">2-склонение</option>
                <option value="3">3-склонение</option>
              </select>
            </div>
          </div>

          {/* Case forms */}
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Келишик шакллари
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CASE_KEYS.map((caseKey, i) => (
                <div key={caseKey} className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {CASE_NAMES[i].ru} ({CASE_NAMES[i].question})
                  </label>
                  <input
                    type="text"
                    value={form[caseKey]}
                    onChange={(e) => handleChange(caseKey, e.target.value)}
                    className="px-3 py-2 rounded-lg outline-none text-white text-sm"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--primary)' }}
            >
              {isSaving
                ? 'Сақланмоқда...'
                : editingId
                  ? 'Сақлаш'
                  : 'Қўшиш'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-lg font-medium text-sm cursor-pointer"
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Бекор
            </button>
          </div>
        </form>
      )}

      {/* Words table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {isLoading ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            Юкланмоқда...
          </div>
        ) : words.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            Сўзлар топилмади
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
                    Сўз
                  </th>
                  <th
                    className="text-left px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Таржима
                  </th>
                  <th
                    className="text-center px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Жинс
                  </th>
                  <th
                    className="text-center px-3 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Склон.
                  </th>
                  <th
                    className="text-right px-5 py-3 font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Амаллар
                  </th>
                </tr>
              </thead>
              <tbody>
                {words.map((word) => (
                  <tr
                    key={word.id}
                    className="hover:bg-white/5 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {word.word}
                      </span>
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {word.word_uz || '-'}
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: 'var(--bg-input)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {word.gender || '-'}
                      </span>
                    </td>
                    <td
                      className="text-center px-3 py-3 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {word.sklonenie || '-'}
                    </td>
                    <td className="text-right px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(word)}
                          className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
                          style={{
                            background: 'rgba(96,165,250,0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(96,165,250,0.3)',
                          }}
                        >
                          Таҳрир
                        </button>
                        <button
                          onClick={() => handleDelete(word)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1 rounded text-xs font-medium cursor-pointer disabled:opacity-50"
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: 'var(--error)',
                            border: '1px solid rgba(239,68,68,0.3)',
                          }}
                        >
                          Ўчириш
                        </button>
                      </div>
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
