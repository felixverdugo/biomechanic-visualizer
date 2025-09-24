
// FIX: The triple-slash directive was causing a type resolution error for '@react-three/fiber'.
// Removing it allows TypeScript to correctly infer the JSX namespace and types from the package imports, which resolves the compilation errors.
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Cone, Plane, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GaitPhase } from '../types';
import { COLORS } from '../constants';

// Helper to create a vector
const vec = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const BODY_WEIGHT_FORCE = 2.0;

// A custom, animated component for force arrows with emissive pulse effect
const AnimatedForceArrow = ({ origin, direction, length, color, pulseTrigger }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color, 
    transparent: true, 
    opacity: 1,
    emissive: color,
    emissiveIntensity: 0.5 
  }), [color]);

  const pulseTime = useRef(0);
  useEffect(() => {
    if (length > 0.01) { // Only pulse if the arrow is visible
      pulseTime.current = 1.0; 
    }
  }, [pulseTrigger]);

  const target = useMemo(() => {
    const quat = new THREE.Quaternion();
    const dir = (direction && direction.lengthSq() > 0) ? direction.clone().normalize() : vec(0, 1, 0);
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    const thickness = THREE.MathUtils.lerp(0.04, 0.09, length / (BODY_WEIGHT_FORCE * 1.2));
    const scaleY = length > 0.01 ? length : 0;
    const opacity = length > 0.01 ? 1 : 0;

    return {
      position: origin,
      quaternion: quat,
      scaleY: scaleY,
      thickness: thickness,
      opacity: opacity,
    };
  }, [origin, direction, length, color]);

  useFrame((state, delta) => {
    if (!groupRef.current || !material) return;

    groupRef.current.position.lerp(target.position, 0.1);
    groupRef.current.quaternion.slerp(target.quaternion, 0.1);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, target.scaleY, 0.1);
    
    material.opacity = THREE.MathUtils.lerp(material.opacity, target.opacity, 0.1);
    
    if (pulseTime.current > 0) {
      const pulseProgress = 1 - pulseTime.current;
      material.emissiveIntensity = 0.5 + Math.sin(pulseProgress * Math.PI) * 2;
      pulseTime.current -= delta * 2; // Pulse lasts ~0.5 seconds
    } else {
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0.5, 0.1);
    }
  });

  const headLength = target.thickness * 4;
  const headWidth = target.thickness * 2.5;

  return (
    <group ref={groupRef} scale-y={0}>
      <group>
        <Cylinder args={[target.thickness, target.thickness, 1, 12]} position={[0, 0.5, 0]} castShadow>
          <primitive object={material} attach="material" />
        </Cylinder>
        <Cone args={[headWidth, headLength, 12]} position={[0, 1, 0]} castShadow>
          <primitive object={material} attach="material" />
        </Cone>
      </group>
    </group>
  );
};

// Custom animated line for compression forces
const AnimatedCompressionLine = ({ start, end, color, visible }) => {
    const lineRef = useRef<any>(null!);
    // Store current points in a ref to avoid re-renders
    const currentPoints = useRef([start.clone(), end.clone()]);
    
    useFrame(() => {
        if (!lineRef.current) return;
        
        const [p1, p2] = currentPoints.current;
        p1.lerp(start, 0.1);
        p2.lerp(end, 0.1);
        
        lineRef.current.geometry.setPositions([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);
        
        const targetOpacity = visible ? 1 : 0;
        lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, targetOpacity, 0.1);
    });

    return (
        <Line
            ref={lineRef}
            points={[start, end]}
            color={color}
            lineWidth={3}
            transparent
            opacity={0}
        />
    );
};

const HumanLeg = ({ phase, pulseTrigger }: { phase: GaitPhase, pulseTrigger: number }) => {
  const forces = useMemo(() => {
    switch (phase) {
      case GaitPhase.STATIC_STAND:
        return {
          grf: { origin: vec(0, -2, 0), dir: vec(0, 1, 0), length: BODY_WEIGHT_FORCE * 1.0 },
          compression: { start: vec(0, -2, 0), end: vec(0, 1.5, 0), visible: true },
          muscle1: { origin: vec(0.1, -0.5, 0.2), dir: vec(0, -1, 0), length: 0.2 }, // Tibialis stability
          muscle2: { origin: vec(-0.1, 0.5, -0.2), dir: vec(0, 1, 0), length: 0.2 }, // Gastrocnemius stability
        };
      case GaitPhase.HEEL_STRIKE:
        return {
          grf: { origin: vec(0, -2, 0.4), dir: vec(0, 1, -0.2), length: BODY_WEIGHT_FORCE * 0.2 },
          compression: { start: vec(0, -2, 0.4), end: vec(0, 1, 0), visible: true },
          muscle1: { origin: vec(0.1, -0.1, 0.2), dir: vec(0, 1, 0), length: 0.8 }, // Tibialis anterior
          muscle2: null,
        };
      case GaitPhase.MIDSTANCE:
        return {
          grf: { origin: vec(0, -2, 0), dir: vec(0, 1, 0), length: BODY_WEIGHT_FORCE * 1.2 },
          compression: { start: vec(0, -2, 0), end: vec(0, 1.5, 0), visible: true },
          muscle1: { origin: vec(-0.1, 1, -0.2), dir: vec(0, -1, 0), length: 1.2 }, // Gastrocnemius
          muscle2: null,
        };
      case GaitPhase.TOE_OFF:
        return {
          grf: { origin: vec(0, -2, -0.4), dir: vec(0, 1, 0.2), length: BODY_WEIGHT_FORCE * 0.8 },
          compression: { start: vec(0, -2, -0.4), end: vec(0, 1.5, 0), visible: true },
          muscle1: { origin: vec(-0.1, 1, -0.2), dir: vec(0, -1, 0), length: 1.5 }, // Gastrocnemius
          muscle2: null,
        };
      default:
        return { grf: null, compression: { visible: false }, muscle1: null, muscle2: null };
    }
  }, [phase]);

  const { grf, compression, muscle1, muscle2 } = forces;
  const emptyVec = vec();

  return (
    <group castShadow>
      {/* Leg Parts */}
      <group castShadow>
        <Cylinder args={[0.3, 0.25, 2, 16]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color={COLORS.SKIN} />
        </Cylinder>
        <Cylinder args={[0.25, 0.2, 2, 16]} position={[0, -1, 0]} castShadow>
          <meshStandardMaterial color={COLORS.SKIN} />
        </Cylinder>
        <Box args={[0.2, 0.8, 0.2]} position={[0.1, -0.5, 0.2]} castShadow>
          <meshStandardMaterial color={COLORS.MUSCLE_ANTERIOR} transparent opacity={0.6} />
        </Box>
        <Box args={[0.3, 1, 0.3]} position={[-0.1, 0.5, -0.2]} castShadow>
           <meshStandardMaterial color={COLORS.MUSCLE_POSTERIOR} transparent opacity={0.6} />
        </Box>
        <Box args={[0.5, 0.2, 1]} position={[0, -2, 0]} castShadow>
          <meshStandardMaterial color={COLORS.SKIN} />
        </Box>
      </group>
      {/* Forces */}
      <AnimatedForceArrow pulseTrigger={pulseTrigger} origin={grf?.origin || emptyVec} direction={grf?.dir} length={grf?.length || 0} color={COLORS.GRF} />
      <AnimatedCompressionLine start={compression?.start || emptyVec} end={compression?.end || emptyVec} color={COLORS.COMPRESSION} visible={compression?.visible} />
      <AnimatedForceArrow pulseTrigger={pulseTrigger} origin={muscle1?.origin || emptyVec} direction={muscle1?.dir} length={muscle1?.length || 0} color={COLORS.MUSCLE_FORCE} />
      <AnimatedForceArrow pulseTrigger={pulseTrigger} origin={muscle2?.origin || emptyVec} direction={muscle2?.dir} length={muscle2?.length || 0} color={COLORS.MUSCLE_FORCE} />
    </group>
  );
};

const ProstheticLeg = ({ phase, pulseTrigger }: { phase: GaitPhase, pulseTrigger: number }) => {
    const forces = useMemo(() => {
    switch (phase) {
      case GaitPhase.STATIC_STAND:
        return {
          grf: { origin: vec(0, -2, 0), dir: vec(0, 1, 0), length: BODY_WEIGHT_FORCE * 1.0 },
          compression: { start: vec(0, -2, 0), end: vec(0, 1.5, 0), visible: true },
        };
      case GaitPhase.HEEL_STRIKE:
        return {
          grf: { origin: vec(0, -2, 0.4), dir: vec(0, 1, -0.2), length: BODY_WEIGHT_FORCE * 0.2 },
          compression: { start: vec(0, -2, 0.4), end: vec(0, 1, 0), visible: true },
        };
      case GaitPhase.MIDSTANCE:
        return {
          grf: { origin: vec(0, -2, 0), dir: vec(0, 1, 0), length: BODY_WEIGHT_FORCE * 1.2 },
          compression: { start: vec(0, -2, 0), end: vec(0, 1.5, 0), visible: true },
        };
      case GaitPhase.TOE_OFF:
        return {
          grf: { origin: vec(0, -2, -0.4), dir: vec(0, 1, 0.2), length: BODY_WEIGHT_FORCE * 0.8 },
          compression: { start: vec(0, -2, -0.4), end: vec(0, 1.5, 0), visible: true },
        };
      default:
        return { grf: null, compression: { visible: false } };
    }
  }, [phase]);

  const { grf, compression } = forces;
  const emptyVec = vec();

  return (
    <group castShadow>
        {/* Prosthesis Parts */}
        <Cylinder args={[0.3, 0.25, 2, 16]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color={COLORS.SKIN} />
        </Cylinder>
        <Cylinder args={[0.25, 0.22, 0.8, 16]} position={[0, -0.4, 0]} castShadow>
          <meshStandardMaterial color={COLORS.PROSTHESIS_SOCKET} />
        </Cylinder>
        <Cylinder args={[0.05, 0.05, 1.2, 16]} position={[0, -1.4, 0]} castShadow>
          <meshStandardMaterial color={COLORS.PROSTHESIS_PYLON} metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Box args={[0.5, 0.2, 1]} position={[0, -2, 0]} castShadow>
          <meshStandardMaterial color={COLORS.PROSTHESIS_FOOT} />
        </Box>
      {/* Forces */}
      <AnimatedForceArrow pulseTrigger={pulseTrigger} origin={grf?.origin || emptyVec} direction={grf?.dir} length={grf?.length || 0} color={COLORS.GRF} />
      <AnimatedCompressionLine start={compression?.start || emptyVec} end={compression?.end || emptyVec} color={COLORS.COMPRESSION} visible={compression?.visible} />
    </group>
  );
};


const SceneContent = ({ phase, setHoverInfo, pulseTrigger }: { phase: GaitPhase; setHoverInfo: React.Dispatch<React.SetStateAction<{ text: string; position: { x: number; y: number; }; } | null>>; pulseTrigger: number; }) => {
  const { camera, size } = useThree();

  const handlePointerOver = (e: any, text: string) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    const p = e.point.clone();
    p.project(camera);
    const x = (p.x * 0.5 + 0.5) * size.width;
    const y = (p.y * -0.5 + 0.5) * size.height;
    setHoverInfo({ text, position: { x, y } });
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHoverInfo(null);
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <group 
        position={[-1.5, 1, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'Pierna Humana')}
        onPointerOut={handlePointerOut}
      >
        <HumanLeg phase={phase} pulseTrigger={pulseTrigger} />
      </group>
      
      <group 
        position={[1.5, 1, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'Prótesis Trans-tibial')}
        onPointerOut={handlePointerOut}
      >
        <ProstheticLeg phase={phase} pulseTrigger={pulseTrigger} />
      </group>
      
      {/* Ground */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]} receiveShadow>
        <meshStandardMaterial color={COLORS.GROUND} />
      </Plane>
    </>
  );
};


const ThreeScene: React.FC<{ phase: GaitPhase }> = ({ phase }) => {
  const [hoverInfo, setHoverInfo] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
  const [pulseTrigger, setPulseTrigger] = useState(0);

  useEffect(() => {
    setPulseTrigger(p => p + 1);
  }, [phase]);

  const labelStyle: React.CSSProperties = useMemo(() => {
    if (!hoverInfo || !hoverInfo.position) {
      return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' };
    }
    return {
      position: 'absolute',
      top: `${hoverInfo.position.y}px`,
      left: `${hoverInfo.position.x}px`,
      transform: 'translate(-50%, -150%)',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease',
      opacity: 1,
      visibility: 'visible',
      zIndex: 10,
    };
  }, [hoverInfo]);
  
  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 1, 10], fov: 50 }}>
        <color attach="background" args={[COLORS.BACKGROUND]} />
        <SceneContent phase={phase} setHoverInfo={setHoverInfo} pulseTrigger={pulseTrigger}/>
        <OrbitControls />
      </Canvas>
      <div 
        className="bg-slate-800/75 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg"
        style={labelStyle}
      >
        {hoverInfo?.text}
      </div>
    </div>
  );
};

export default ThreeScene;
