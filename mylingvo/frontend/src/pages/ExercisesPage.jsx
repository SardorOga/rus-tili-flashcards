import { useState } from 'react';
import useExerciseStore from '../stores/exerciseStore';
import DeclineExercise from '../components/exercises/DeclineExercise';
import IdentifyExercise from '../components/exercises/IdentifyExercise';
import FormExercise from '../components/exercises/FormExercise';

const TABS = [
  { key: 'decline', label: 'Тусла', description: 'Барча 6 келишикни тўлдиринг' },
  { key: 'identify', label: 'Аниқла', description: 'Сўзнинг келишигини аниқланг' },
  { key: 'form', label: 'Тўғри шакл', description: 'Тўғри шаклни танланг' },
];

export default function ExercisesPage() {
  const [activeTab, setActiveTab] = useState('decline');
  const score = useExerciseStore((s) => s.score);
  const resetScore = useExerciseStore((s) => s.resetScore);

  const handleTabChange = (key) => {
    setActiveTab(key);
    resetScore();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Машқлар
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Рус тили келишикларини машқ қилинг
          </p>
        </div>

        {/* Score display */}
        <div
          className="flex items-center gap-4 px-4 py-2 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>
              {score.correct}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              тўғри
            </span>
          </div>
          <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold" style={{ color: 'var(--error)' }}>
              {score.wrong}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              хато
            </span>
          </div>
          <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {score.total}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              жами
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className="flex-1 py-3 px-4 text-sm font-medium cursor-pointer transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
              borderRight:
                tab.key !== 'form' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <span className="block font-semibold">{tab.label}</span>
            <span
              className="block text-xs mt-0.5"
              style={{
                color: activeTab === tab.key ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
              }}
            >
              {tab.description}
            </span>
          </button>
        ))}
      </div>

      {/* Active exercise */}
      <div>
        {activeTab === 'decline' && <DeclineExercise />}
        {activeTab === 'identify' && <IdentifyExercise />}
        {activeTab === 'form' && <FormExercise />}
      </div>
    </div>
  );
}
