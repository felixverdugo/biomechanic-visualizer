import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import Header from './components/Header';
import RenderGallery from './components/RenderGallery';
import { GaitPhase, AppView } from './types';

export default function App() {
  const [phase, setPhase] = useState<GaitPhase>(GaitPhase.STATIC_STAND);
  const [view, setView] = useState<AppView>('simulator');

  return (
    // On large screens, contain the app within the viewport height. On smaller screens, allow the page to scroll.
    <main className="bg-gray-100 text-gray-800 font-sans lg:h-screen lg:flex lg:flex-col lg:items-center lg:p-4">
      <div className="w-full max-w-7xl lg:flex lg:flex-col lg:h-full">
        
        <Header currentView={view} setView={setView} />

        {view === 'simulator' && (
          <>
            {/* Main content area: 
                - On desktop it grows to fill the remaining vertical space.
                - On mobile it's a standard block, allowing the page to scroll.
                - On desktop, its children (canvas/info) are in a row.
                - On mobile, they are in a column.
            */}
            <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-2xl shadow-xl p-4 md:p-6 mx-2 md:mx-4 lg:mx-0 border border-gray-200 lg:flex-grow lg:min-h-0">
              
              {/* Canvas container: 
                  - Uses aspect ratio on mobile for a sensible height.
                  - Fills available height on desktop.
              */}
              <div className="lg:w-2/3 relative aspect-square md:aspect-video lg:aspect-auto rounded-lg overflow-hidden bg-gray-200">
                 <ThreeScene phase={phase} />
              </div>

              {/* InfoPanel container */}
              <aside className="lg:w-1/3 flex">
                <InfoPanel phase={phase} />
              </aside>
            </div>
            
            <footer className="p-4 md:p-6 lg:p-0 lg:mt-6 lg:flex-shrink-0">
              <ControlPanel currentPhase={phase} setPhase={setPhase} />
            </footer>
          </>
        )}

        {view === 'renders' && (
           <div className="flex-grow lg:overflow-y-auto">
            <RenderGallery />
          </div>
        )}

      </div>
    </main>
  );
}
