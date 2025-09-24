import { GaitPhase } from './types';

export const PHASE_DESCRIPTIONS: Record<GaitPhase, { title: string; description: string }> = {
  [GaitPhase.STATIC_STAND]: {
    title: 'Reposo Estático',
    description: 'El peso del cuerpo se distribuye verticalmente. La Fuerza de Reacción del Suelo (FRS, en rojo) es igual y opuesta al peso corporal.\n\n**Tibia:** La carga compresiva (azul) es soportada directamente por la estructura ósea, con mínima actividad muscular (verde) para mantener el equilibrio.\n\n**Prótesis:** La carga se transmite a través del pilón al encaje y al muñón. Una alineación correcta es crucial para que las fuerzas se distribuyan de forma similar a la pierna biológica.'
  },
  [GaitPhase.HEEL_STRIKE]: {
    title: 'Contacto del Talón',
    description: 'Inicio de la fase de apoyo. La FRS se aplica en el talón.\n\n**Tibia:** El hueso absorbe el impacto inicial. El músculo tibial anterior se activa para controlar el descenso del pie, evitando que golpee el suelo.\n\n**Prótesis:** El talón del pie protésico, a menudo con un material que absorbe impactos, emula la función del tejido adiposo del talón. La prótesis carece de control muscular activo; su diseño mecánico controla el movimiento de balanceo.'
  },
  [GaitPhase.MIDSTANCE]: {
    title: 'Fase Media de Apoyo',
    description: 'El cuerpo pasa sobre el pie. La FRS alcanza su punto máximo, al igual que las fuerzas de compresión internas.\n\n**Tibia:** Soporta la máxima compresión de todo el ciclo. Los músculos de la pantorrilla se activan para estabilizar el tobillo y controlar el avance de la tibia sobre el pie.\n\n**Prótesis:** Las fuerzas de compresión máximas se transmiten a través del pilón. La quilla del pie protésico proporciona una base estable y un balanceo controlado, simulando la función del tobillo.'
  },
  [GaitPhase.TOE_OFF]: {
    title: 'Despegue de Dedos',
    description: 'Final de la fase de apoyo. La FRS se desplaza hacia la punta del pie para generar propulsión.\n\n**Tibia:** Los músculos de la pantorrilla se contraen potentemente para impulsar el cuerpo hacia adelante (flexión plantar), usando la tibia como palanca.\n\n**Prótesis:** Los pies protésicos modernos (especialmente los de fibra de carbono) almacenan energía durante la fase media y la liberan en el despegue. Esto genera propulsión y busca una equivalencia funcional con el impulso muscular.'
  }
};

export const COLORS = {
  BACKGROUND: 0xF3F4F6, // gray-100
  GROUND: 0xD1D5DB,     // gray-300
  SKIN: 0xE4A07E,       // Natural skin tone
  BONE: 0xffffff,
  MUSCLE_ANTERIOR: 0xC05A5A, // Desaturated red
  MUSCLE_POSTERIOR: 0xB04A4A, // Darker desaturated red
  PROSTHESIS_SOCKET: 0x6B7280, // gray-500
  PROSTHESIS_PYLON: 0x4B5563,  // gray-600
  PROSTHESIS_FOOT: 0x374151,   // gray-700
  GRF: 0xef4444,
  COMPRESSION: 0x3b82f6,
  MUSCLE_FORCE: 0x22c55e,
};
