'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fibreTexture } from './fibreTexture';

type Layer = { base: string; side: string; inks: string[] };

// The three layers echo the logo mark: beige, green, grey.
const LAYERS: Layer[] = [
  { base: '#D9C7A9', side: '#C4B08E', inks: ['rgba(255,255,255,.5)', 'rgba(150,125,90,.55)', 'rgba(98,154,34,.35)'] },
  { base: '#6FA52F', side: '#557F22', inks: ['rgba(255,255,255,.3)', 'rgba(50,90,15,.55)', 'rgba(217,199,169,.5)'] },
  { base: '#8A8A88', side: '#6E6E6C', inks: ['rgba(255,255,255,.3)', 'rgba(60,60,60,.5)', 'rgba(217,199,169,.4)'] },
];
const BOARD: Layer = { base: '#DCCDB3', side: '#BFAE90', inks: ['rgba(120,100,70,.55)', 'rgba(255,255,255,.45)', 'rgba(98,154,34,.4)', 'rgba(90,90,88,.45)'] };

const W = 3.4, D = 2.1, T = 0.17;
const smooth = (x: number) => x * x * (3 - 2 * x);

function Slab({ layer, density, y, seed, refCb }: { layer: Layer; density: number; y: number; seed: number; refCb?: (m: THREE.Mesh | null) => void }) {
  const mats = useMemo(() => {
    const tex = fibreTexture({ base: layer.base, inks: layer.inks, density, seed });
    const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.82, metalness: 0 });
    const side = new THREE.MeshStandardMaterial({ color: layer.side, roughness: 0.9 });
    return { list: [side, side, top, top, side, side], tex, top, side };
  }, [layer, density, seed]);
  useEffect(() => () => { mats.tex.dispose(); mats.top.dispose(); mats.side.dispose(); }, [mats]);
  return (
    <mesh ref={refCb} position={[0, y, 0]} material={mats.list} castShadow receiveShadow>
      <boxGeometry args={[W, T, D]} />
    </mesh>
  );
}

function Rig({ mode, progress, rotation, density, animate }: Props) {
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<(THREE.Mesh | null)[]>([]);
  const p = useRef(mode === 'hero' && !animate ? 0.5 : 0);
  const rot = useRef(0);
  const { camera, size, invalidate } = useThree();

  useEffect(() => { invalidate(); }, [density, size, invalidate]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const aspect = size.width / size.height;
    const fit = Math.min(1, aspect * 0.66); // keep the panel inside narrow viewports
    g.scale.setScalar(fit);
    const t = state.clock.elapsedTime;
    if (mode === 'hero') {
      const target = animate ? progress?.current ?? 0 : 0.5;
      p.current += (target - p.current) * Math.min(1, dt * 6);
      const q = p.current;
      const sep = Math.sin(Math.PI * smooth(Math.min(1, Math.max(0, q)))) * 0.62; // apart, then back together
      slabs.current.forEach((m, i) => { if (m) m.position.y = (1 - i) * (T + sep); });
      const float = animate ? Math.sin(t * 0.6) * 0.035 : 0;
      g.position.y = float + 0.1;
      g.rotation.set(0.5 - q * 0.16, -0.62 + q * 1.5 + (animate ? Math.sin(t * 0.25) * 0.03 : 0), 0);
      camera.position.set(0, 0.7 + q * 0.5, 8 - Math.sin(Math.PI * q) * 0.6);
      camera.lookAt(0, 0, 0);
    } else {
      const target = rotation?.current ?? 0;
      rot.current += (target - rot.current) * Math.min(1, dt * 8);
      g.rotation.set(0.62, -0.55 + rot.current, 0);
      camera.position.set(0, 0.4, 6.4);
      camera.lookAt(0, 0, 0);
      if (Math.abs(target - rot.current) > 0.001) invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 7, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0004} />
      <directionalLight position={[-6, 2, -3]} intensity={0.55} color="#DDEBC8" />
      <group ref={group}>
        {mode === 'hero'
          ? LAYERS.map((l, i) => <Slab key={i} layer={l} density={1400} seed={11 + i * 9} y={(1 - i) * T} refCb={(m) => { slabs.current[i] = m; }} />)
          : <Slab layer={BOARD} density={density ?? 750} seed={23} y={0} />}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.13} />
      </mesh>
    </>
  );
}

type Props = {
  mode: 'hero' | 'explorer';
  /** hero: scroll progress 0..1 */
  progress?: React.RefObject<number>;
  /** explorer: target rotation in radians */
  rotation?: React.RefObject<number>;
  density?: number;
  /** false = static frame (reduced motion or off screen) */
  animate?: boolean;
  onReady?: () => void;
};

export default function PanelCanvas(props: Props) {
  const loop = props.mode === 'hero' && props.animate ? 'always' : 'demand';
  return (
    <Canvas shadows dpr={[1, 1.75]} frameloop={loop} camera={{ fov: 30, near: 0.1, far: 50, position: [0, 0.7, 7.2] }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-hidden="true" onCreated={() => props.onReady?.()}>
      <Rig {...props} />
    </Canvas>
  );
}
