import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import { GaitPhase } from './types';

export default function App() {
  const [phase, setPhase] = useState<GaitPhase>(GaitPhase.STATIC_STAND);

  return (
    <main className="bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-7xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800">Visualizador Biomecánico</h1>
          <p className="text-lg text-gray-600">Pierna Humana vs. Prótesis Trans-tibial</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex-grow lg:w-2/3 relative h-[60vh] lg:h-auto rounded-lg overflow-hidden bg-gray-200">
             <ThreeScene phase={phase} />
          </div>
          <aside className="lg:w-1/3">
            <InfoPanel phase={phase} />
          </aside>
        </div>
        
        <footer className="mt-6">
          <ControlPanel currentPhase={phase} setPhase={setPhase} />
        </footer>
      </div>
    </main>
  );
}