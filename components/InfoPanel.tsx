import React from 'react';
import { GaitPhase } from '../types';
import { PHASE_DESCRIPTIONS } from '../constants';

interface InfoPanelProps {
  phase: GaitPhase;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ phase }) => {
  const { title, description } = PHASE_DESCRIPTIONS[phase];

  const renderDescription = (text: string) => {
    // Divide el texto en párrafos basados en dobles saltos de línea
    return text.split('\n\n').map((paragraph, pIndex) => {
      // Divide cada párrafo en partes: texto normal y texto en negrita
      const parts = paragraph.split(/(\*\*.*?\*\*)/g).filter(Boolean);
      return (
        <p key={pIndex} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIndex} className="font-semibold text-slate-700">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={partIndex}>{part}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg h-full flex flex-col justify-center shadow-inner border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-300 pb-2">{title}</h2>
      <div>
        {renderDescription(description)}
      </div>
    </div>
  );
};

export default InfoPanel;
