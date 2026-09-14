"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TURNS = 5;
const NODES_PER_TURN = 16;
const RADIUS = 1.6;
const HEIGHT = 9;

// Deterministic PRNG so particle placement stays stable across renders and
// never introduces impurity into the render pass.
const createRandom = (seed: number) => {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const buildHelix = () => {
  const total = TURNS * NODES_PER_TURN;
  const nodes: number[] = [];
  const colors: number[] = [];
  const rungs: number[] = [];
  const strandA = new THREE.Color("#fb7185");
  const strandB = new THREE.Color("#22d3ee");

  for (let index = 0; index < total; index += 1) {
    const angle = (index / NODES_PER_TURN) * Math.PI * 2;
    const y = (index / (total - 1)) * HEIGHT - HEIGHT / 2;
    const ax = Math.cos(angle) * RADIUS;
    const az = Math.sin(angle) * RADIUS;
    const bx = Math.cos(angle + Math.PI) * RADIUS;
    const bz = Math.sin(angle + Math.PI) * RADIUS;

    nodes.push(ax, y, az, bx, y, bz);
    colors.push(strandA.r, strandA.g, strandA.b, strandB.r, strandB.g, strandB.b);

    if (index % 2 === 0) {
      rungs.push(ax, y, az, bx, y, bz);
    }
  }

  return {
    nodePositions: new Float32Array(nodes),
    nodeColors: new Float32Array(colors),
    rungPositions: new Float32Array(rungs),
  };
};

const buildParticles = (count: number) => {
  const random = createRandom(0x5eed);
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    values[index * 3] = (random() - 0.5) * 24;
    values[index * 3 + 1] = (random() - 0.5) * 15;
    values[index * 3 + 2] = (random() - 0.5) * 12;
  }

  return values;
};

const Helix = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodePositions, nodeColors, rungPositions } = useMemo(
    () => buildHelix(),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    group.rotation.y += delta * 0.22;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      state.pointer.y * 0.18,
      0.04,
    );
    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      state.pointer.x * 0.5,
      0.04,
    );
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0.35]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[rungPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#f472b6"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};

const ParticleField = ({ count = 520 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => buildParticles(count), [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#cbd5e1"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const HeroSceneCanvas = ({ active }: { active: boolean }) => (
  <Canvas
    dpr={[1, 1.75]}
    frameloop={active ? "always" : "never"}
    camera={{ position: [0, 0, 10], fov: 45 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  >
    <Helix />
    <ParticleField />
  </Canvas>
);

export default HeroSceneCanvas;
