import React, { useState, useRef, useEffect } from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = (view: AppView) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <header className="relative text-center p-6 lg:flex-shrink-0">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">Salud Cinética en Acción: Un Análisis Interactivo</h1>
      <p className="text-md lg:text-lg text-gray-600 mt-2">Comparativa: Pierna Humana vs. Prótesis Trans-tibial</p>

      <div ref={menuRef} className="absolute top-4 right-4 md:top-6 md:right-6">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full text-slate-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>

        {menuOpen && (
          <nav className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
            <ul>
              <li>
                <button
                  onClick={() => handleLinkClick('simulator')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentView === 'simulator'
                      ? 'bg-slate-100 text-slate-800 font-semibold'
                      : 'text-gray-700 hover:bg-slate-50'
                  }`}
                >
                  Simulador de Fuerzas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('renders')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentView === 'renders'
                      ? 'bg-slate-100 text-slate-800 font-semibold'
                      : 'text-gray-700 hover:bg-slate-50'
                  }`}
                >
                  Galería de Renders 3D
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
