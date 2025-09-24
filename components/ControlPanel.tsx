import React from 'react';
import { GaitPhase } from '../types';

interface ControlPanelProps {
  currentPhase: GaitPhase;
  setPhase: (phase: GaitPhase) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ currentPhase, setPhase }) => {
  const phases = Object.values(GaitPhase);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200">
      <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Fases de la Marcha</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setPhase(phase)}
            className={`w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${
              currentPhase === phase
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={currentPhase === phase}
          >
            {phase}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;