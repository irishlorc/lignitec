'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mulberry } from './fibreTexture';

/** Everything the scene needs, tweened from outside (GSAP) and read every frame. */
export type FibreState = {
  assemble: number; // 0 loose cloud, 1 pressed panel
  split: number; // layer separation
  bind: number; // green binder glow
  density: number; // share of fibres drawn (750/1400 for MD)
  layered: number; // 1 = logo colours per layer, 0 = one board colour
  angle: number; elev: number; dist: number; // camera orbit
};

const W = 3.4, D = 2.1, T = 0.17;
const BG = new THREE.Color('#131813');

const vert = /* glsl */ `
attribute vec3 aStart; attribute vec3 aTarget; attribute vec3 aRot; attribute vec4 aMisc;
uniform float uTime, uAssemble, uSplit, uDensity, uLayered, uBind; uniform vec2 uHalf;
varying vec3 vN; varying vec3 vCol; varying float vDepth; varying float vGlow;
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }
void main(){
  float seed = aMisc.w, layer = aMisc.z;
  float d = seed * 0.55;
  float t = smoothstep(d, d + 0.45, uAssemble);
  vec3 drift = vec3(sin(uTime*.31+seed*40.), cos(uTime*.23+seed*23.), sin(uTime*.27+seed*61.)) * .45;
  vec3 s = rotY(uTime*.05) * aStart + drift;
  vec3 tg = aTarget; tg.y += (1. - layer) * uSplit;
  vec3 p = mix(s, tg, t);
  p.y += sin(t*3.14159) * (seed - .5) * 1.2;
  float yaw = mix(aRot.x + uTime*.25*(seed-.5), aRot.z, t);
  float pitch = mix(aRot.y + uTime*.2*(fract(seed*7.)-.5), 0., t);
  mat3 R = rotY(yaw) * rotZ(pitch);
  float vis = step(fract(seed*13.37), uDensity);
  vec3 local = position; local.x *= aMisc.x; local.yz *= aMisc.y * mix(1.25, 1., t) * vis;
  vec3 world = R * local + p;
  // as the panel closes, trim overhanging fibre ends to a clean machined edge
  float crisp = t*t*t*t;
  world.x = mix(world.x, clamp(world.x, -uHalf.x, uHalf.x), crisp);
  world.z = mix(world.z, clamp(world.z, -uHalf.y, uHalf.y), crisp);
  vN = normalize(normalMatrix * (R * normal));
  vec4 mv = modelViewMatrix * vec4(world, 1.);
  vDepth = -mv.z;
  vec3 straw = mix(vec3(.80,.71,.55), vec3(.95,.90,.78), fract(seed*5.3));
  straw = mix(straw, vec3(.47,.66,.2), step(.84, fract(seed*3.1)));
  vec3 lay = layer < .5 ? vec3(.88,.80,.67) : layer < 1.5 ? vec3(.43,.66,.17) : vec3(.60,.60,.59);
  vec3 board = mix(vec3(.78,.69,.53), vec3(.93,.87,.74), fract(seed*5.3));
  board = mix(board, vec3(.5,.66,.25), step(.9, fract(seed*3.1)));
  vCol = mix(straw, mix(board, lay * mix(.78,1.15,fract(seed*9.7)), uLayered), t);
  vGlow = uBind * step(.5, layer) * step(layer, 1.5) * (1. - t*.6);
  gl_Position = projectionMatrix * mv;
}`;

const frag = /* glsl */ `
uniform vec3 uFog; uniform float uFogNear, uFogFar;
varying vec3 vN; varying vec3 vCol; varying float vDepth; varying float vGlow;
void main(){
  vec3 n = normalize(vN);
  float d1 = max(dot(n, normalize(vec3(.45,.8,.55))), 0.);
  float d2 = max(dot(n, normalize(vec3(-.7,.25,-.4))), 0.);
  vec3 c = vCol * (.30 + .9*d1) + vCol * d2 * vec3(.16,.24,.12);
  c += vGlow * vec3(.08,.2,.01);
  c = mix(c, uFog, smoothstep(uFogNear, uFogFar, vDepth));
  c = mix(c, uFog * .6, smoothstep(3.2, .6, vDepth)); // foreground falls into shadow
  gl_FragColor = vec4(c, 1.);
}`;

function buildFibres(count: number) {
  const r = mulberry(77);
  const base = new THREE.CylinderGeometry(1, 1, 1, 5, 1);
  base.rotateZ(Math.PI / 2); // lie along x
  const g = new THREE.InstancedBufferGeometry();
  g.index = base.index; g.attributes.position = base.attributes.position; g.attributes.normal = base.attributes.normal;
  const start = new Float32Array(count * 3), target = new Float32Array(count * 3), rot = new Float32Array(count * 3), misc = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    // loose cloud: an ellipsoid the camera travels through
    const u = r() * Math.PI * 2, v = Math.acos(2 * r() - 1), rad = Math.cbrt(r());
    start.set([Math.sin(v) * Math.cos(u) * 7 * rad, Math.cos(v) * 4 * rad, Math.sin(v) * Math.sin(u) * 4.6 * rad], i * 3);
    const layer = i % 3, k = r();
    let x = (r() - 0.5) * W, y = (r() - 0.5) * T, z = (r() - 0.5) * D, yaw = (r() - 0.5) * 0.7;
    if (k < 0.5) y = T / 2 - 0.004 + r() * 0.012; // top face
    else if (k < 0.62) y = -T / 2 + 0.004 - r() * 0.012; // underside
    else if (k < 0.76) z = (r() < 0.5 ? -1 : 1) * (D / 2 - 0.004 + r() * 0.01); // long edges
    else if (k < 0.86) { x = (r() < 0.5 ? -1 : 1) * (W / 2 - 0.004 + r() * 0.01); yaw = Math.PI / 2 + (r() - 0.5) * 0.3; } // short edges
    target.set([x, y + (1 - layer) * T, z], i * 3);
    rot.set([r() * Math.PI * 2, (r() - 0.5) * 2.4, yaw], i * 3);
    misc.set([0.22 + r() * 0.42, 0.007 + r() * 0.008, layer, r()], i * 4);
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(start, 3));
  g.setAttribute('aTarget', new THREE.InstancedBufferAttribute(target, 3));
  g.setAttribute('aRot', new THREE.InstancedBufferAttribute(rot, 3));
  g.setAttribute('aMisc', new THREE.InstancedBufferAttribute(misc, 4));
  g.instanceCount = count;
  return g;
}

const SLABS = ['#C6B28E', '#4F7E1C', '#757573'];
const BOARD = '#BFAB86';

function Scene({ state, animate, mode }: { state: React.RefObject<FibreState>; animate: boolean; mode: 'film' | 'explorer' }) {
  const { camera, size, invalidate } = useThree();
  const count = size.width < 700 ? 5200 : 10500;
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<(THREE.Mesh | null)[]>([]);
  const time = useRef(3);

  const mesh = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 }, uAssemble: { value: 0 }, uSplit: { value: 0 }, uDensity: { value: 1 }, uLayered: { value: 1 }, uBind: { value: 0 },
        uFog: { value: BG }, uFogNear: { value: 6 }, uFogFar: { value: 16 }, uHalf: { value: new THREE.Vector2(W / 2 + 0.006, D / 2 + 0.006) },
      },
    });
    const m = new THREE.Mesh(buildFibres(count), mat);
    m.frustumCulled = false;
    return m;
  }, [count]);
  useEffect(() => () => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); }, [mesh]);
  useEffect(() => { invalidate(); });

  useFrame((_, dt) => {
    const s = state.current; if (!s) return;
    if (animate) time.current += Math.min(dt, 0.05);
    const u = (mesh.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value = time.current; u.uAssemble.value = s.assemble; u.uSplit.value = s.split;
    u.uDensity.value = s.density; u.uLayered.value = s.layered; u.uBind.value = s.bind;
    u.uFogNear.value = s.dist - 1.5; u.uFogFar.value = s.dist + 8;

    const solid = THREE.MathUtils.smoothstep(s.assemble, 0.86, 1);
    slabs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = (1 - i) * (T + s.split);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = solid; m.visible = solid > 0.01;
      mat.color.set(SLABS[i]).lerp(new THREE.Color(BOARD), 1 - s.layered);
    });

    const aspect = size.width / size.height;
    const portrait = aspect < 0.9;
    if (group.current) group.current.scale.setScalar(mode === 'film' ? THREE.MathUtils.clamp(aspect * 0.95, 0.56, 1) : THREE.MathUtils.clamp(aspect * 0.8, 0.6, 1));
    const ce = Math.cos(s.elev);
    camera.position.set(Math.sin(s.angle) * ce * s.dist, Math.sin(s.elev) * s.dist, Math.cos(s.angle) * ce * s.dist);
    camera.lookAt(0, mode === 'film' && portrait ? -1.15 : mode === 'film' ? -0.25 : 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4.5, 8, 5.5]} intensity={2.2} />
      <group ref={group}>
        <primitive object={mesh} />
        {SLABS.map((c, i) => (
          <mesh key={i} ref={(m) => { slabs.current[i] = m; }} visible={false}>
            <boxGeometry args={[W - 0.02, T - 0.012, D - 0.02]} />
            <meshStandardMaterial color={c} roughness={0.95} transparent opacity={0} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function FibreStage({ state, mode, animate = true, active = true, onReady }: {
  state: React.RefObject<FibreState>; mode: 'film' | 'explorer'; animate?: boolean; active?: boolean; onReady?: () => void;
}) {
  return (
    <Canvas dpr={[1, 1.6]} frameloop={!active ? 'never' : animate ? 'always' : 'demand'} camera={{ fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-hidden="true" onCreated={() => onReady?.()}>
      <Scene state={state} animate={animate} mode={mode} />
    </Canvas>
  );
}
