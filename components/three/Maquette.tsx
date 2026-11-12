'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * An architectural model in the manner of a clay maquette. It is an
 * illustration of where the panels are intended to go, not a real project.
 */
type V3 = [number, number, number];
export type SceneId = 'furniture' | 'kitchen' | 'fitout' | 'wet';

const CLAY = '#EDE4D3', WALL = '#F7F2E8', FLOOR = '#E4D9C5', DARK = '#3B403B', TINT = '#BFD79F', LIVE = '#5F9A1E', WHITE = '#FBF9F4';

const VIEWS: Record<SceneId, { pos: V3; look: V3 }> = {
  furniture: { pos: [-2.2, 2.3, 4.6], look: [-3.1, 0.95, -2.7] },
  kitchen: { pos: [3.2, 2.3, 4.2], look: [2.1, 1.1, -2.7] },
  fitout: { pos: [0.4, 2.2, 3.2], look: [-5.9, 1.1, -0.3] },
  wet: { pos: [8.9, 2.7, 6.2], look: [8.6, 1.35, -2.9] },
};

/** Where each hotspot marker floats, keyed by scene then hotspot id. */
export const MARKERS: Record<SceneId, Record<string, V3>> = {
  furniture: { doors: [-4, 0.5, -2.3], shelves: [-1.9, 1.75, -2.5], top: [-4.6, 1.05, -2.6] },
  kitchen: { carcass: [3.75, 1.5, -2.3], fronts: [1.0, 0.5, -2.25], sink: [2.3, 1.3, -2.8] },
  fitout: { wall: [-5.8, 2.0, -1.2], bench: [-5.3, 0.7, 0.4], reveal: [-0.35, 2.35, -2.8] },
  wet: { vanity: [6.6, 0.6, -2.3], wetwall: [7.5, 2.1, -2.85], facade: [10.6, 2.6, -2.8] },
};

type Ctx = { scene: SceneId; part: string };

function Box({ p, s, color = CLAY, scene, part, ctx }: { p: V3; s: V3; color?: string; scene?: SceneId; part?: string; ctx: React.RefObject<Ctx> }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const base = useMemo(() => new THREE.Color(color), [color]);
  const tint = useMemo(() => new THREE.Color(TINT), []);
  const live = useMemo(() => new THREE.Color(LIVE), []);
  useFrame(() => {
    if (!mat.current || !part) return;
    const c = ctx.current!;
    const target = scene === c.scene ? (part === c.part ? live : tint) : base;
    mat.current.color.lerp(target, 0.12);
  });
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial ref={mat} color={color} roughness={1} />
    </mesh>
  );
}

function Marker({ at, n, on, onPick }: { at: V3; n: number; on: boolean; onPick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((st) => { if (ref.current) ref.current.position.y = at[1] + Math.sin(st.clock.elapsedTime * 2 + n) * 0.035; });
  return (
    <group ref={ref} position={at} onClick={(e) => { e.stopPropagation(); onPick(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      <mesh scale={1.32}><sphereGeometry args={[0.13, 24, 24]} /><meshBasicMaterial color="#ffffff" side={THREE.BackSide} /></mesh>
      <mesh><sphereGeometry args={[0.13, 24, 24]} /><meshBasicMaterial color={on ? '#1F2420' : '#7DBB33'} /></mesh>
    </group>
  );
}

function Model({ scene, part, onPick, hotspots, animate }: Props) {
  const ctx = useRef<Ctx>({ scene, part });
  ctx.current = { scene, part };
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(...VIEWS[scene].look));
  const first = useRef(true);

  useEffect(() => {
    const v = VIEWS[scene];
    // pull the camera back on narrow screens so the whole setting stays in frame
    const back = size.width / size.height < 1 ? 1.45 : 1;
    const pos: V3 = [v.look[0] + (v.pos[0] - v.look[0]) * back, v.look[1] + (v.pos[1] - v.look[1]) * back, v.look[2] + (v.pos[2] - v.look[2]) * back];
    if (first.current || !animate) {
      camera.position.set(...pos); look.current.set(...v.look); first.current = false;
      return;
    }
    const a = gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2], duration: 1.6, ease: 'power3.inOut' });
    const b = gsap.to(look.current, { x: v.look[0], y: v.look[1], z: v.look[2], duration: 1.6, ease: 'power3.inOut' });
    return () => { a.kill(); b.kill(); };
  }, [scene, camera, size.width, size.height, animate]);

  useFrame(() => camera.lookAt(look.current));

  const B = (props: Omit<Parameters<typeof Box>[0], 'ctx'>) => <Box {...props} ctx={ctx} />;

  return (
    <>
      <hemisphereLight args={['#ffffff', '#E6DBC6', 1.25]} />
      <directionalLight position={[4, 9, 7]} intensity={1.35} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-camera-far={40} shadow-bias={-0.0005} shadow-normalBias={0.03} />

      {/* shell */}
      <B p={[3, -0.05, 0.5]} s={[20, 0.1, 10]} color={FLOOR} />
      <B p={[1.2, 1.5, -3.05]} s={[14.6, 3, 0.1]} color={WALL} />
      <B p={[-6.05, 1.5, -0.25]} s={[0.1, 3, 5.6]} color={WALL} />
      <B p={[5.05, 1.5, -1.6]} s={[0.1, 3, 2.9]} color={WALL} />
      <B p={[8.35, 1.5, -1.6]} s={[0.1, 3, 2.9]} color={WALL} />

      {/* furniture */}
      <B scene="furniture" part="doors" p={[-4, 0.5, -2.7]} s={[2.2, 0.64, 0.5]} />
      <B scene="furniture" part="top" p={[-4, 0.845, -2.7]} s={[2.32, 0.05, 0.56]} />
      {[-4.95, -3.05].map((x) => <B key={x} p={[x, 0.09, -2.7]} s={[0.06, 0.18, 0.4]} color={DARK} />)}
      {[-4.55, -3.45].map((x) => <B key={x} p={[x, 0.5, -2.44]} s={[0.012, 0.3, 0.012]} color={DARK} />)}
      {[-2.52, -1.28].map((x) => <B key={x} scene="furniture" part="shelves" p={[x, 1.1, -2.8]} s={[0.05, 2.2, 0.36]} />)}
      {[0.04, 0.55, 1.07, 1.6, 2.17].map((y) => <B key={y} scene="furniture" part="shelves" p={[-1.9, y, -2.8]} s={[1.2, 0.05, 0.36]} />)}
      {([[-2.3, 0.75, 0.22, 0.34], [-2.05, 0.7, 0.14, 0.24], [-1.6, 1.25, 0.4, 0.3], [-2.2, 1.78, 0.5, 0.3], [-1.55, 0.72, 0.16, 0.28]] as number[][]).map(([x, y, w, h], i) => <B key={i} p={[x, y, -2.8]} s={[w, h, 0.22]} color={WHITE} />)}

      {/* fit-out: door reveal between the two settings */}
      {[-0.95, 0.25].map((x) => <B key={x} scene="fitout" part="reveal" p={[x, 1.05, -2.92]} s={[0.14, 2.1, 0.22]} />)}
      <B scene="fitout" part="reveal" p={[-0.35, 2.17, -2.92]} s={[1.34, 0.14, 0.22]} />
      <B p={[-0.35, 1.05, -2.99]} s={[1.06, 2.1, 0.04]} color={DARK} />
      {/* fit-out: wall panelling and bench on the side wall */}
      {[-2.35, -1.3, -0.25, 0.8, 1.85].map((z) => <B key={z} scene="fitout" part="wall" p={[-5.97, 1.4, z]} s={[0.05, 2.6, 1.0]} />)}
      <B scene="fitout" part="bench" p={[-5.62, 0.24, 0.3]} s={[0.62, 0.48, 3.0]} />
      <B p={[-5.62, 0.5, 0.3]} s={[0.66, 0.05, 3.04]} color={WHITE} />

      {/* kitchen */}
      <B scene="kitchen" part="carcass" p={[2.0, 0.45, -2.72]} s={[2.8, 0.82, 0.56]} />
      <B p={[2.0, 0.03, -2.7]} s={[2.8, 0.06, 0.5]} color={DARK} />
      {[0.88, 1.44, 2.0, 2.56, 3.12].map((x) => <B key={x} scene="kitchen" part="fronts" p={[x, 0.47, -2.425]} s={[0.53, 0.76, 0.03]} />)}
      <B p={[2.0, 0.89, -2.7]} s={[2.9, 0.045, 0.66]} color={WHITE} />
      <B p={[2.3, 0.9, -2.68]} s={[0.62, 0.05, 0.4]} color={DARK} />
      <B p={[2.3, 1.08, -2.93]} s={[0.04, 0.32, 0.04]} color={DARK} />
      <B scene="kitchen" part="sink" p={[2.3, 1.22, -2.985]} s={[1.3, 0.6, 0.04]} />
      <B p={[1.7, 1.92, -2.83]} s={[2.2, 0.7, 0.34]} />
      {[0.88, 1.43, 1.98, 2.53].map((x) => <B key={x} scene="kitchen" part="fronts" p={[x, 1.92, -2.645]} s={[0.52, 0.66, 0.03]} />)}
      <B scene="kitchen" part="carcass" p={[3.82, 1.13, -2.72]} s={[0.76, 2.26, 0.56]} />
      <B p={[3.82, 1.5, -2.43]} s={[0.56, 0.5, 0.02]} color={DARK} />

      {/* wet room */}
      {[5.6, 6.62, 7.64].map((x) => <B key={x} scene="wet" part="wetwall" p={[x, 1.4, -2.97]} s={[0.98, 2.6, 0.05]} />)}
      <B scene="wet" part="vanity" p={[6.6, 0.55, -2.68]} s={[1.5, 0.5, 0.5]} />
      <B p={[6.6, 0.83, -2.68]} s={[1.56, 0.06, 0.54]} color={WHITE} />
      <B p={[6.6, 0.9, -2.66]} s={[0.56, 0.1, 0.36]} color={WHITE} />
      <B p={[6.6, 1.6, -2.93]} s={[0.8, 0.9, 0.03]} color={WHITE} />
      {/* façade */}
      <B p={[10.4, 2, -3.0]} s={[4, 4, 0.2]} color={WALL} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (r === 1 || r === 2) && c === 1
        ? <B key={`${r}${c}`} p={[9.2 + c * 1.2, 0.55 + r * 0.98, -2.88]} s={[1.14, 0.92, 0.03]} color={DARK} />
        : <B key={`${r}${c}`} scene="wet" part="facade" p={[9.2 + c * 1.2, 0.55 + r * 0.98, -2.86]} s={[1.14, 0.92, 0.06]} />))}

      {hotspots.map((id, i) => MARKERS[scene][id] && <Marker key={`${scene}-${id}`} at={MARKERS[scene][id]} n={i + 1} on={id === part} onPick={() => onPick(i)} />)}
    </>
  );
}

type Props = { scene: SceneId; part: string; hotspots: string[]; onPick: (i: number) => void; animate: boolean };

export default function Maquette(props: Props & { active: boolean }) {
  return (
    <Canvas flat shadows="soft" dpr={[1, 1.6]} frameloop={props.active ? 'always' : 'never'} camera={{ fov: 38, near: 0.1, far: 80, position: VIEWS[props.scene].pos }} gl={{ antialias: true }}>
      <color attach="background" args={['#EFE8DB']} />
      <fog attach="fog" args={['#EFE8DB', 14, 30]} />
      <Model {...props} />
    </Canvas>
  );
}
