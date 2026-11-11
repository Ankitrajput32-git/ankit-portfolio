"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/*
 * Pixel, the site's robot, built from primitives (no model file). Glossy
 * clearcoat plastic lit by a generated studio environment, a glass visor
 * with glowing eyes that blink, follow the pointer and turn into happy arcs
 * on hover, a beating heart, mitten hands that wave, and a hover jet with a
 * shadow that shrinks as Pixel bobs up. Soft glows are sprites with normal blending (additive vanishes over the
 * light page behind the transparent canvas), which reads
 * like bloom without a post-processing pass. Loaded lazily by assistant.tsx.
 */

const SHELL = "#f7f2e8";
const VISOR = "#0b1016";
const GLOW = "#5cc8ff";
const ACCENT = "#2188bb";
const BLUSH = "#ff8fab";
const HEART = "#ff6b8b";

type Look = { x: number; y: number; moved: number };
const { damp } = THREE.MathUtils;

/** Radial gradient on a canvas: white for glows, black for the shadow */
function radialTexture(inner: string, outer: string) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.4);
  s.bezierCurveTo(-0.3, -0.25, -0.45, -0.05, -0.45, 0.1);
  s.bezierCurveTo(-0.45, 0.32, -0.28, 0.42, -0.17, 0.42);
  s.bezierCurveTo(-0.07, 0.42, 0, 0.34, 0, 0.26);
  s.bezierCurveTo(0, 0.34, 0.07, 0.42, 0.17, 0.42);
  s.bezierCurveTo(0.28, 0.42, 0.45, 0.32, 0.45, 0.1);
  s.bezierCurveTo(0.45, -0.05, 0.3, -0.25, 0, -0.4);
  return new THREE.ShapeGeometry(s, 16);
}

/** Studio reflections generated in code, so nothing is downloaded */
function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    room.dispose();
    pmrem.dispose();
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}

/* Points scattered in a band around Pixel, for the orbiting sparkles */
function sparkleGeometry(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const r = 1.05 + Math.random() * 0.35;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = -0.9 + Math.random() * 2.1;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.6;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

const easeOutBack = (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function Bot({
  look,
  wave,
  talking,
  still,
  spin,
}: {
  look: RefObject<Look>;
  wave: boolean;
  talking: boolean;
  still: boolean;
  /** Bumped on every click: Pixel hops and spins once */
  spin: number;
}) {
  const rig = useRef<THREE.Group>(null);
  const pad = useRef<THREE.Group>(null);
  const dashes = useRef<THREE.Group>(null);
  const padRing = useRef<THREE.MeshBasicMaterial>(null);
  const sparkles = useRef<THREE.Points>(null);
  const sparkleMat = useRef<THREE.PointsMaterial>(null);
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const ovals = useRef<(THREE.Group | null)[]>([]);
  const arcs = useRef<(THREE.Mesh | null)[]>([]);
  const cheeks = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const mouth = useRef<THREE.Mesh>(null);
  const antenna = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const jet = useRef<THREE.Sprite>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const state = useRef({ blinkAt: 1.8, blinkUntil: 0, happy: 0, t0: -1, spinAt: -10, spinSeen: spin });

  const res = useMemo(
    () => ({
      head: new RoundedBoxGeometry(1.62, 1.26, 1.2, 8, 0.4),
      rim: new RoundedBoxGeometry(1.34, 0.92, 0.1, 8, 0.045),
      visor: new RoundedBoxGeometry(1.26, 0.84, 0.14, 8, 0.06),
      body: new RoundedBoxGeometry(0.98, 0.76, 0.84, 8, 0.32),
      heart: heartShape(),
      sparkles: sparkleGeometry(16),
      glow: radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)"),
      shade: radialTexture("rgba(0,0,0,0.55)", "rgba(0,0,0,0)"),
    }),
    []
  );
  useEffect(
    () => () => {
      Object.values(res).forEach((r) => r.dispose());
    },
    [res]
  );

  useFrame((frame, delta) => {
    if (still) return;
    const t = frame.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const s = state.current;

    // Entrance: fly up from below with a turn and land with a bounce
    if (s.t0 < 0) s.t0 = t;
    const enter = Math.min((t - s.t0) / 1.2, 1);
    const landed = easeOutBack(enter);
    // Click: one hop-and-spin
    if (spin !== s.spinSeen) {
      s.spinSeen = spin;
      s.spinAt = t;
    }
    const sp = Math.min((t - s.spinAt) / 0.8, 1);
    const spinTurn = sp < 1 ? easeInOut(sp) * Math.PI * 2 : 0;
    const hop = sp < 1 ? Math.sin(sp * Math.PI) * 0.35 : 0;
    rig.current!.position.y = (1 - landed) * -2.6 + hop;
    rig.current!.rotation.y = (1 - easeInOut(enter)) * Math.PI * 1.5 + spinTurn;
    rig.current!.scale.setScalar(0.7 + 0.3 * landed);

    // Hover pad: rings fade in after landing, pulse, and the dashes turn
    pad.current!.scale.setScalar(0.4 + 0.6 * Math.min(enter * 1.4, 1));
    padRing.current!.opacity = (0.35 + Math.sin(t * 2.4) * 0.15) * enter;
    dashes.current!.rotation.z = t * 0.6;
    sparkles.current!.rotation.y = t * 0.35;
    sparkleMat.current!.opacity = (0.55 + Math.sin(t * 3.1) * 0.25) * enter;

    // Bob and sway; the shadow and jet answer the height
    const bob = Math.sin(t * 1.6) * 0.07;
    root.current!.position.y = bob;
    root.current!.rotation.z = Math.sin(t * 0.9) * 0.03;
    shadow.current!.scale.setScalar(1 - bob * 1.6);
    (shadow.current!.material as THREE.MeshBasicMaterial).opacity = (0.55 - bob * 1.5 - hop) * enter;
    jet.current!.scale.setScalar(0.42 + Math.sin(t * 22) * 0.04 + Math.sin(t * 9) * 0.03);

    // Look at the pointer; when it rests, glance around on its own
    const idle = t - look.current.moved > 3;
    const lx = idle ? Math.sin(t * 0.55) * 0.5 : look.current.x;
    const ly = idle ? Math.sin(t * 0.8) * 0.2 : look.current.y;
    head.current!.rotation.y = damp(head.current!.rotation.y, lx * 0.42, 5, dt);
    head.current!.rotation.x = damp(head.current!.rotation.x, -ly * 0.22, 5, dt);
    head.current!.rotation.z = damp(head.current!.rotation.z, wave ? 0.12 : -lx * 0.05, 4, dt);
    eyes.current!.position.x = damp(eyes.current!.position.x, lx * 0.09, 8, dt);
    eyes.current!.position.y = damp(eyes.current!.position.y, 0.06 + ly * 0.05, 8, dt);

    // Happy arcs on hover, blinking ovals otherwise
    s.happy = damp(s.happy, wave ? 1 : 0, 10, dt);
    if (t > s.blinkAt) {
      s.blinkUntil = t + 0.13;
      s.blinkAt = t + 2.2 + Math.random() * 3.2;
    }
    const lid = t < s.blinkUntil ? 0.1 : 1;
    ovals.current.forEach((o) => {
      if (!o) return;
      o.scale.y = damp(o.scale.y, lid * (1 - s.happy), 30, dt);
      o.scale.x = 1 - s.happy * 0.3;
    });
    arcs.current.forEach((a) => a?.scale.setScalar(Math.max(s.happy, 0.0001)));
    cheeks.current.forEach((c) => {
      if (c) c.opacity = 0.6 + s.happy * 0.35;
    });

    // Mouth opens and closes while a reply streams in
    const talk = talking ? 1 + Math.abs(Math.sin(t * 16)) * 1.2 : 1 + s.happy * 0.25;
    mouth.current!.scale.y = damp(mouth.current!.scale.y, talk, 20, dt);

    // Antenna lags the head; the heart beats twice, then rests
    antenna.current!.rotation.z = damp(antenna.current!.rotation.z, Math.sin(t * 2.6) * 0.12 - lx * 0.25, 4, dt);
    const beat = t % 1.4;
    const pulse = beat < 0.12 ? 1.18 : beat < 0.22 ? 1 : beat < 0.34 ? 1.12 : 1;
    heart.current!.scale.setScalar(damp(heart.current!.scale.x, 0.22 * pulse, 18, dt));

    // Right arm waves on hover, both sway gently otherwise
    const waveTo = wave ? -2.45 + Math.sin(t * 12) * 0.38 : 0.3 + Math.sin(t * 1.6) * 0.06;
    armR.current!.rotation.z = damp(armR.current!.rotation.z, waveTo, 8, dt);
    armL.current!.rotation.z = damp(armL.current!.rotation.z, -0.3 - Math.sin(t * 1.6) * 0.06, 8, dt);
  });

  const plastic = (
    <meshPhysicalMaterial color={SHELL} roughness={0.34} clearcoat={1} clearcoatRoughness={0.12} />
  );
  const accent = <meshPhysicalMaterial color={ACCENT} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />;
  const halo = (size: number, color: string, opacity: number) => (
    <spriteMaterial
      map={res.glow}
      color={color}
      transparent
      opacity={opacity}
      blending={THREE.NormalBlending}
      depthWrite={false}
      toneMapped={false}
      attach="material"
      key={size}
    />
  );

  return (
    <>
      {/* Contact shadow on an imaginary floor */}
      <mesh ref={shadow} position={[0, -1.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={res.shade} transparent depthWrite={false} opacity={0.55} />
      </mesh>

      {/* Hover pad: a pulsing ring, a turning dashed ring and a soft glow */}
      <group ref={pad} position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.9, 1.9]} />
          <meshBasicMaterial
            map={res.glow}
            color={GLOW}
            transparent
            opacity={0.22}
            blending={THREE.NormalBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.5, 0.56, 64]} />
          <meshBasicMaterial
            ref={padRing}
            color={GLOW}
            transparent
            opacity={0.35}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <group ref={dashes}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0]} rotation={[0, 0, a]}>
                <planeGeometry args={[0.03, 0.12]} />
                <meshBasicMaterial
                  color={GLOW}
                  transparent
                  opacity={0.45}
                  depthWrite={false}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Sparkles orbiting slowly */}
      <points ref={sparkles} geometry={res.sparkles}>
        <pointsMaterial
          ref={sparkleMat}
          map={res.glow}
          color={GLOW}
          size={0.1}
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.NormalBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      <group ref={rig}>
      <group ref={root}>
        {/* Head */}
        <group ref={head} position={[0, 0.42, 0]}>
          <mesh geometry={res.head}>{plastic}</mesh>

          {/* Visor: blue rim, glass face */}
          <mesh geometry={res.rim} position={[0, -0.02, 0.54]}>
            {accent}
          </mesh>
          <mesh geometry={res.visor} position={[0, -0.02, 0.57]}>
            <meshPhysicalMaterial color={VISOR} roughness={0.06} metalness={0.2} clearcoat={1} clearcoatRoughness={0.04} />
          </mesh>

          <group position={[0, -0.02, 0.65]}>
            <group ref={eyes} position={[0, 0.06, 0]}>
              {[-0.26, 0.26].map((ex, i) => (
                <group key={ex} position={[ex, 0, 0]}>
                  <sprite scale={0.62} position={[0, 0, -0.01]}>
                    {halo(1, GLOW, 0.55)}
                  </sprite>
                  <group
                    ref={(el) => {
                      ovals.current[i] = el;
                    }}
                  >
                    <mesh scale={[0.13, 0.18, 0.04]}>
                      <sphereGeometry args={[1, 24, 16]} />
                      <meshBasicMaterial color={GLOW} toneMapped={false} />
                    </mesh>
                    <mesh position={[0.045, 0.065, 0.03]} scale={0.036}>
                      <sphereGeometry args={[1, 12, 8]} />
                      <meshBasicMaterial color="#ffffff" toneMapped={false} />
                    </mesh>
                  </group>
                  {/* happy "^" */}
                  <mesh
                    ref={(el) => {
                      arcs.current[i] = el;
                    }}
                    position={[0, -0.03, 0.01]}
                    scale={0.0001}
                  >
                    <torusGeometry args={[0.11, 0.028, 8, 24, Math.PI]} />
                    <meshBasicMaterial color={GLOW} toneMapped={false} />
                  </mesh>
                </group>
              ))}
            </group>

            {[-0.43, 0.43].map((bx, i) => (
              <mesh key={bx} position={[bx, -0.17, 0.01]} scale={[1, 0.6, 1]}>
                <circleGeometry args={[0.09, 24]} />
                <meshBasicMaterial
                  ref={(el) => {
                    cheeks.current[i] = el;
                  }}
                  color={BLUSH}
                  transparent
                  opacity={0.6}
                  toneMapped={false}
                />
              </mesh>
            ))}
            <mesh ref={mouth} position={[0, -0.19, 0.01]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.1, 0.022, 8, 24, Math.PI]} />
              <meshBasicMaterial color={GLOW} toneMapped={false} />
            </mesh>
          </group>

          {/* Ears with glowing rings */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.84, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.13, 32]} />
                {accent}
              </mesh>
              <mesh position={[0, side * -0.067, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.1, 0.018, 8, 32]} />
                <meshBasicMaterial color={GLOW} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* Antenna */}
          <group ref={antenna} position={[0, 0.62, 0]}>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.026, 0.03, 0.32, 12]} />
              {accent}
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <sphereGeometry args={[0.1, 24, 16]} />
              <meshBasicMaterial color={GLOW} toneMapped={false} />
            </mesh>
            <sprite position={[0, 0.36, 0]} scale={0.55}>
              {halo(2, GLOW, 0.6)}
            </sprite>
          </group>
        </group>

        {/* Body */}
        <group position={[0, -0.62, 0]}>
          <mesh geometry={res.body}>{plastic}</mesh>
          <mesh ref={heart} geometry={res.heart} position={[0, 0.03, 0.425]} scale={0.22}>
            <meshBasicMaterial color={HEART} toneMapped={false} />
          </mesh>
          <sprite position={[0, 0.03, 0.43]} scale={0.38}>
            {halo(3, HEART, 0.45)}
          </sprite>

          {/* Arms hang from shoulder pivots; mitten hands in the accent */}
          {[
            { ref: armR, x: 0.53, z: 0.3 },
            { ref: armL, x: -0.53, z: -0.3 },
          ].map(({ ref, x, z }) => (
            <group key={x} ref={ref} position={[x, 0.18, 0]} rotation={[0, 0, z]}>
              <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.095, 0.26, 6, 16]} />
                {plastic}
              </mesh>
              <mesh position={[0, -0.44, 0]}>
                <sphereGeometry args={[0.12, 24, 16]} />
                {accent}
              </mesh>
            </group>
          ))}

          {/* Hover jet */}
          <mesh position={[0, -0.43, 0]}>
            <cylinderGeometry args={[0.2, 0.14, 0.1, 32]} />
            {accent}
          </mesh>
          <sprite ref={jet} position={[0, -0.56, 0.05]} scale={0.42}>
            {halo(4, GLOW, 0.85)}
          </sprite>
        </group>
      </group>
      </group>
    </>
  );
}

/** The canvas itself. `still` renders one static frame (reduced motion). */
export function RobotCanvas({
  wave,
  talking,
  still,
  spin,
  anchor,
}: {
  wave: boolean;
  talking: boolean;
  still: boolean;
  spin: number;
  /** Element Pixel's eyes measure the pointer from */
  anchor: RefObject<HTMLElement | null>;
}) {
  const look = useRef<Look>({ x: 0, y: 0, moved: -10 });
  // Low-power devices skip the generated studio reflections (the costliest
  // startup step) and render at a lower pixel ratio
  const [lowEnd] = useState(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  });

  useEffect(() => {
    if (still) return;
    const start = performance.now();
    const onMove = (e: PointerEvent) => {
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      look.current.x = THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5), -1, 1);
      look.current.y = THREE.MathUtils.clamp((r.top + r.height / 2 - e.clientY) / (window.innerHeight * 0.5), -1, 1);
      // seconds on the same clock as the canvas, roughly: since mount
      look.current.moved = (performance.now() - start) / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [anchor, still]);

  return (
    <Canvas
      dpr={lowEnd ? 1.5 : 2}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 0.08, 5.8], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      style={{ pointerEvents: "none" }}
    >
      {lowEnd ? <hemisphereLight args={["#ffffff", "#c9d6e2", 1.4]} /> : <Studio />}
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, 3]} intensity={0.5} />
      <directionalLight position={[-2, 3, -4]} intensity={1.6} color={ACCENT} />
      <Bot look={look} wave={wave} talking={talking} still={still} spin={spin} />
    </Canvas>
  );
}
