import React, { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { STAGES } from './loopStages';

/**
 * The AquaSol control loop (the team's flow diagram), told in eight stages. Each stage draws its
 * edge groups one after another; a group's nodes light when its signal lands. A camera frames the
 * stage being told: it eases to the stage in the first part of the stage, pans across it when the
 * stage is wider than the view, and pulls back to the whole loop for the last stage.
 *
 * `pos` is stages elapsed: 3.4 means stage 3 (Irrigate), 40% through. While the section is pinned,
 * Working's ScrollTrigger drives it; otherwise (reduced motion, or no room to pin) the tabs pick a
 * stage and the view cuts straight to it, fully drawn.
 */

// Every link, in diagram units. `no` marks the untraced "No" branches.
const EDGES: { id: string; d: string; no?: boolean; arrow?: false }[] = [
  { id: 'e-start-node', d: 'M655 60 V82 H385 V110' },
  { id: 'e-start-drone', d: 'M655 60 V82 H950 V110' },
  { id: 'e-lora-node', d: 'M510 240 V300' },
  { id: 'e-lora-drone', d: 'M770 240 V300' },
  { id: 'e-dock-gate', d: 'M835 240 V300' },
  { id: 'e-gate-irr', d: 'M655 410 V440 H410 V470' },
  { id: 'e-gate-pest', d: 'M655 410 V440 H900 V470' },
  { id: 'e-irr-yes', d: 'M410 590 V650' },
  { id: 'e-open-irr', d: 'M410 694 V716' },
  { id: 'e-irr-close', d: 'M410 760 V782' },
  { id: 'e-cycle-bus', d: 'M410 826 V918', arrow: false },
  { id: 'e-bus-dash', d: 'M410 918 H660' },
  { id: 'e-bus-cont', d: 'M410 918 H210 V700' },
  { id: 'e-pest-yes', d: 'M1010 530 H1070 V640' },
  { id: 'e-alert-dash', d: 'M1070 696 V880' },
  { id: 'e-loop', d: 'M135 670 H122 V175 H150' },
  { id: 'e-gate-cloud', d: 'M855 335 H1180' },
  { id: 'e-cloud-gate', d: 'M1180 375 H855' },
  { id: 'e-cloud-app', d: 'M1300 550 V918 H1100' },
  { id: 'e-irr-no', d: 'M300 530 H210 V640', no: true },
  { id: 'e-pest-no', d: 'M900 590 V880', no: true },
];
const TRACED = EDGES.filter((e) => !e.no);

const VIEW_W = 1440;
const VIEW_H = 975;
const PAD = 36; // room around a stage's frame
const S_MIN = 0.86; // camera scale floor: 14-unit text never renders below 12px
const S_MAX = 1.25;
const EASE_IN = 0.28; // share of a stage spent moving the camera
const DRAW_FROM = 0.28; // then the stage draws...
const DRAW_TO = 0.92; // ...and holds the finished result

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

type Box = { x: number; y: number; w: number; h: number };
type Cam = { cx: number; cy: number; s: number };

interface Props {
  step: number;
  /** Scroll drives `pos` through `drive`; otherwise the view cuts to `step`, fully drawn. */
  driven: boolean;
  reduced: boolean;
  drive: React.Ref<(pos: number) => void>;
  className?: string;
}

export const LoopDiagram: React.FC<Props> = ({ step, driven, reduced, drive, className }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pos = useRef(step + 0.999);
  const size = useRef({ w: 0, h: 0 });
  const frames = useRef<Box[]>([]);
  const els = useRef<{
    edges: Map<string, { path: SVGPathElement; len: number; dot: SVGCircleElement }>;
    nodes: Map<string, SVGGElement>;
    water: SVGRectElement | null;
  } | null>(null);
  const visible = useRef(false);
  const raf = useRef(0);
  const N = STAGES.length;
  const settled = (p: number) => !reduced && p >= N - 1 + DRAW_TO;

  /** Scale and centre that show stage k at local progress u (0..1). */
  const target = (k: number, u: number, zoomFloor: boolean): Cam => {
    const { w: cw, h: ch } = size.current;
    const f = frames.current[k];
    if (!f || !cw || !ch) return { cx: VIEW_W / 2, cy: VIEW_H / 2, s: 1 };
    let s = Math.min(cw / f.w, ch / f.h, S_MAX);
    if (STAGES[k].frame !== 'all' && zoomFloor) s = Math.max(s, S_MIN);
    // Wider (or taller) than the view: pan across it while the stage draws.
    const pan = clamp((u - DRAW_FROM) / (DRAW_TO - DRAW_FROM));
    const vw = cw / s;
    const vh = ch / s;
    const cx = f.w <= vw ? f.x + f.w / 2 : lerp(f.x + vw / 2, f.x + f.w - vw / 2, pan);
    const cy = f.h <= vh ? f.y + f.h / 2 : lerp(f.y + vh / 2, f.y + f.h - vh / 2, pan);
    return { cx, cy, s };
  };

  const overview = (): Cam => {
    const { w: cw, h: ch } = size.current;
    return { cx: VIEW_W / 2, cy: VIEW_H / 2, s: cw && ch ? Math.min(cw / VIEW_W, ch / VIEW_H) : 1 };
  };

  const camera = (p: number, zoomFloor: boolean): Cam => {
    const k = Math.min(N - 1, Math.max(0, Math.floor(p)));
    const u = clamp(p - k);
    // A cut (not scroll-driven): hold the stage centred, still at a readable zoom.
    if (!zoomFloor) return target(k, (DRAW_FROM + DRAW_TO) / 2, true);
    const to = target(k, u, zoomFloor);
    const from = k === 0 ? overview() : target(k - 1, 1, zoomFloor);
    const e = smooth(clamp(u / EASE_IN));
    return {
      cx: lerp(from.cx, to.cx, e),
      cy: lerp(from.cy, to.cy, e),
      s: Math.exp(lerp(Math.log(from.s), Math.log(to.s), e)),
    };
  };

  // Imperative: runs per scroll frame while pinned, so it writes attributes instead of re-rendering.
  const paint = (p: number) => {
    const svg = svgRef.current;
    const E = els.current;
    if (!svg || !E) return;
    const { w: cw, h: ch } = size.current;
    if (cw && ch) {
      const c = camera(p, driven);
      const vw = cw / c.s;
      const vh = ch / c.s;
      svg.setAttribute('viewBox', `${(c.cx - vw / 2).toFixed(1)} ${(c.cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
    }
    const cur = Math.min(N - 1, Math.floor(p));
    const looping = settled(p);
    const lit = new Set<string>(p > 0 ? ['n-start'] : []);
    STAGES.forEach((st, k) => {
      const t = clamp((p - k - DRAW_FROM) / (DRAW_TO - DRAW_FROM));
      const g = st.groups.length;
      st.groups.forEach((grp, j) => {
        const draw = clamp(t * g - j);
        for (const id of grp.e) {
          const edge = E.edges.get(id);
          if (!edge) continue;
          edge.path.style.strokeDashoffset = String(1 - draw);
          edge.path.style.opacity = draw <= 0 ? '0' : k === cur ? '1' : '0.5';
          if (looping) continue; // the idle loop owns the packets
          const moving = draw > 0 && draw < 1;
          if (moving) {
            const pt = edge.path.getPointAtLength(edge.len * draw);
            edge.dot.setAttribute('cx', pt.x.toFixed(1));
            edge.dot.setAttribute('cy', pt.y.toFixed(1));
          }
          edge.dot.style.opacity = moving ? '1' : '0';
        }
        if (draw >= 1) grp.n.forEach((n) => lit.add(n));
        // the field fills while the next step (close valve) draws
        if (grp.water && E.water) E.water.setAttribute('width', String(Math.round(170 * clamp(t * g - j - 1))));
      });
    });
    E.nodes.forEach((el, id) => el.classList.toggle('is-lit', lit.has(id)));
  };

  const loop = (now: number) => {
    raf.current = 0;
    const E = els.current;
    if (!E || !visible.current || !settled(pos.current)) return;
    let i = 0;
    for (const { path, len, dot } of E.edges.values()) {
      const pt = path.getPointAtLength(len * ((now / 1800 + i++ * 0.17) % 1));
      dot.setAttribute('cx', pt.x.toFixed(1));
      dot.setAttribute('cy', pt.y.toFixed(1));
      dot.style.opacity = '0.9';
    }
    raf.current = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf.current && visible.current && settled(pos.current)) raf.current = requestAnimationFrame(loop);
  };

  // Always the latest closures for the imperative handle and observers.
  const live = useRef({ paint, kick });
  useLayoutEffect(() => {
    live.current = { paint, kick };
  });

  useImperativeHandle(
    drive,
    () => (p: number) => {
      pos.current = p;
      live.current.paint(p);
      live.current.kick();
    },
    [],
  );

  // Cache elements, lengths and each stage's frame once; track the viewport's size and visibility.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const edges = new Map<string, { path: SVGPathElement; len: number; dot: SVGCircleElement }>();
    for (const { id } of TRACED) {
      const path = svg.querySelector<SVGPathElement>(`[data-trace="${id}"]`);
      const dot = svg.querySelector<SVGCircleElement>(`[data-packet="${id}"]`);
      if (path && dot) edges.set(id, { path, len: path.getTotalLength(), dot });
    }
    const nodes = new Map<string, SVGGElement>();
    svg.querySelectorAll<SVGGElement>('[data-node]').forEach((n) => nodes.set(n.id, n));
    els.current = { edges, nodes, water: svg.querySelector('[data-water]') };

    const bbox = (id: string): Box | null => {
      const el = svg.querySelector<SVGGraphicsElement>(`#${id}, [data-trace="${id}"]`);
      if (!el) return null;
      const b = el.getBBox();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    };
    frames.current = STAGES.map((st) => {
      if (st.frame === 'all') return { x: 0, y: 0, w: VIEW_W, h: VIEW_H };
      const boxes = st.frame.map(bbox).filter((b): b is Box => !!b);
      const x = Math.min(...boxes.map((b) => b.x)) - PAD;
      const y = Math.min(...boxes.map((b) => b.y)) - PAD;
      const r = Math.max(...boxes.map((b) => b.x + b.w)) + PAD;
      const btm = Math.max(...boxes.map((b) => b.y + b.h)) + PAD;
      return { x, y, w: r - x, h: btm - y };
    });

    const ro = new ResizeObserver(([entry]) => {
      size.current = { w: entry.contentRect.width, h: entry.contentRect.height };
      live.current.paint(pos.current);
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      live.current.kick();
    });
    io.observe(wrap);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  // Not scroll-driven: cut to the chosen stage, fully drawn.
  useLayoutEffect(() => {
    if (driven) return;
    pos.current = step + 0.999;
    live.current.paint(pos.current);
    live.current.kick();
  }, [step, driven]);

  return (
    <div ref={wrapRef} className={`aql ${className ?? ''}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="aql-title aql-desc"
      >
        <title id="aql-title">The AquaSol control loop</title>
        <desc id="aql-desc">
          From start, ESP32 sensor nodes and a one-time drone scan send readings and in-flight results
          over LoRa to the master gateway. The gateway's local decision engine checks two things. If
          irrigation is required it opens the solenoid valve, irrigates the field and closes the
          valve; otherwise it continues monitoring. If disease or pests are detected it raises an
          alert. Results update the AquaSol app with pest-detected regions and soil moisture. After
          docking, the drone uploads all its images and data to the gateway. When online, the gateway
          syncs with the cloud over Wi-Fi; the cloud sends analytics and recommendations to the app
          and pushes model updates and fault fixes back to the gateway. The system then returns to
          monitoring.
        </desc>
        <defs>
          <marker id="aql-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="aql-arrowhead" />
          </marker>
          <clipPath id="aql-water-clip">
            <rect x="325" y="716" width="170" height="44" rx="12" />
          </clipPath>
        </defs>

        <g aria-hidden="true">
          {/* stage bands */}
          {[262, 432, 612, 858].map((y) => (
            <line key={y} className="aql-band" x1="20" y1={y} x2="1420" y2={y} />
          ))}
          {[
            [124, '01', 'SENSE'],
            [294, '02', 'COLLECT'],
            [464, '03', 'DECIDE'],
            [644, '04', 'ACT'],
            [890, '05', 'REPORT'],
          ].map(([y, n, label]) => (
            <text key={label} className="aql-t-band" x="22" y={y}>
              <tspan x="22">{n}</tspan>
              <tspan x="22" dy="16">{label}</tspan>
            </text>
          ))}

          {/* every path, always faintly visible */}
          {EDGES.map((e) => (
            <path
              key={e.id}
              className={e.no ? 'aql-base aql-base--no' : 'aql-base'}
              d={e.d}
              markerEnd={e.arrow === false ? undefined : 'url(#aql-arrow)'}
            />
          ))}
          {/* the signal */}
          {TRACED.map((e) => (
            <path key={e.id} className="aql-trace" data-trace={e.id} d={e.d} pathLength={1} />
          ))}

          <g className="aql-node" id="n-start" data-node="">
            <rect className="aql-box" x="585" y="20" width="140" height="40" rx="20" />
            <text className="aql-t-step" x="655" y="45" textAnchor="middle">Start</text>
          </g>

          <g className="aql-node" id="n-node" data-node="">
            <rect className="aql-box" x="150" y="110" width="470" height="130" rx="16" />
            <text className="aql-t-title" x="172" y="143">ESP32 sensor node</text>
            <text className="aql-t-tag" x="600" y="142" textAnchor="end">GROUND LEVEL</text>
            <circle className="aql-dot" cx="176" cy="177" r="3" />
            <text className="aql-t-item" x="186" y="182">Soil moisture sensor</text>
            <circle className="aql-dot" cx="176" cy="209" r="3" />
            <text x="186" y="214"><tspan className="aql-t-part">PT100 + MAX31865</tspan><tspan className="aql-t-item"> temperature</tspan></text>
            <circle className="aql-dot" cx="416" cy="177" r="3" />
            <text x="426" y="182"><tspan className="aql-t-part">SHT45</tspan><tspan className="aql-t-item"> air temp, humidity</tspan></text>
            <circle className="aql-dot" cx="416" cy="209" r="3" />
            <text className="aql-t-item" x="426" y="214">Battery monitor</text>
          </g>

          <g className="aql-node" id="n-drone" data-node="">
            <rect className="aql-box" x="740" y="110" width="420" height="130" rx="16" />
            <text className="aql-t-title" x="762" y="143">Drone field scan</text>
            <text className="aql-t-tag" x="1140" y="142" textAnchor="end">ONCE · PARTLY BUILT</text>
            <circle className="aql-dot" cx="766" cy="177" r="3" />
            <text className="aql-t-item" x="776" y="182">Thermal camera</text>
            <circle className="aql-dot" cx="766" cy="209" r="3" />
            <text className="aql-t-item" x="776" y="214">RGB camera</text>
            <circle className="aql-dot" cx="960" cy="177" r="3" />
            <text className="aql-t-item" x="970" y="182">Multispectral sensor</text>
          </g>

          <g id="l-lora">
            <rect className="aql-pill aql-pill--radio" x="476" y="259" width="68" height="22" rx="11" />
            <text className="aql-t-pill" x="510" y="274" textAnchor="middle">LoRa</text>
            <rect className="aql-pill aql-pill--radio" x="736" y="259" width="68" height="22" rx="11" />
            <text className="aql-t-pill" x="770" y="274" textAnchor="middle">LoRa</text>
            <text className="aql-t-item" x="726" y="275" textAnchor="end">In flight: results</text>
            <text className="aql-t-item" x="848" y="264">After docking:</text>
            <text className="aql-t-item" x="848" y="283">all images and data</text>
          </g>

          <g className="aql-node" id="n-gate" data-node="">
            <rect className="aql-box" x="455" y="300" width="400" height="110" rx="16" />
            <text className="aql-t-title" x="477" y="333">Master gateway</text>
            <text className="aql-t-tag" x="835" y="332" textAnchor="end">DATA COLLECTION</text>
            <circle className="aql-dot" cx="481" cy="370" r="3" />
            <text className="aql-t-item" x="491" y="375">Data aggregation</text>
            <circle className="aql-dot" cx="661" cy="370" r="3" />
            <text className="aql-t-item" x="671" y="375">Local decision engine</text>
          </g>

          <g className="aql-node" id="n-irr" data-node="">
            <polygon className="aql-box" points="410,470 520,530 410,590 300,530" />
            <text className="aql-t-q" x="410" y="526" textAnchor="middle">Irrigation</text>
            <text className="aql-t-q" x="410" y="546" textAnchor="middle">required?</text>
          </g>
          <g className="aql-node" id="n-pest" data-node="">
            <polygon className="aql-box" points="900,470 1010,530 900,590 790,530" />
            <text className="aql-t-q" x="900" y="526" textAnchor="middle">Disease or</text>
            <text className="aql-t-q" x="900" y="546" textAnchor="middle">pest detected?</text>
          </g>

          <rect className="aql-pill aql-pill--yes" x="386" y="608" width="48" height="20" rx="10" />
          <text className="aql-t-pill aql-t-yes" x="410" y="622" textAnchor="middle">YES</text>
          <rect className="aql-pill" x="233" y="520" width="44" height="20" rx="10" />
          <text className="aql-t-pill aql-t-no" x="255" y="534" textAnchor="middle">NO</text>
          <rect className="aql-pill aql-pill--yes" x="1016" y="520" width="48" height="20" rx="10" />
          <text className="aql-t-pill aql-t-yes" x="1040" y="534" textAnchor="middle">YES</text>
          <rect className="aql-pill" x="878" y="700" width="44" height="20" rx="10" />
          <text className="aql-t-pill aql-t-no" x="900" y="714" textAnchor="middle">NO</text>

          <g className="aql-node" id="n-cont" data-node="">
            <rect className="aql-box" x="135" y="640" width="150" height="60" rx="14" />
            <text className="aql-t-step" x="210" y="666" textAnchor="middle">Continue</text>
            <text className="aql-t-step" x="210" y="686" textAnchor="middle">monitoring</text>
          </g>

          <g id="l-cycle">
            <rect className="aql-cycle" x="310" y="632" width="200" height="206" rx="18" />
            <text className="aql-t-tag aql-t-water" x="524" y="734">
              <tspan x="524">IRRIGATION</tspan>
              <tspan x="524" dy="15">CYCLE</tspan>
            </text>
          </g>
          <g className="aql-node" id="n-open" data-node="">
            <rect className="aql-box" x="325" y="650" width="170" height="44" rx="12" />
            <text className="aql-t-step" x="410" y="677" textAnchor="middle">Open solenoid valve</text>
          </g>
          <g className="aql-node" id="n-irrigate" data-node="">
            <rect className="aql-box" x="325" y="716" width="170" height="44" rx="12" />
            <rect className="aql-water" data-water="" x="325" y="716" width="0" height="44" clipPath="url(#aql-water-clip)" />
            <text className="aql-t-step" x="410" y="743" textAnchor="middle">Irrigate field</text>
          </g>
          <g className="aql-node" id="n-close" data-node="">
            <rect className="aql-box" x="325" y="782" width="170" height="44" rx="12" />
            <text className="aql-t-step" x="410" y="809" textAnchor="middle">Close valve</text>
          </g>

          <g className="aql-node aql-node--alert" id="n-alert" data-node="">
            <rect className="aql-box" x="1000" y="640" width="140" height="56" rx="14" />
            <path className="aql-bell" d="M1029 675 h14 l-2 -3 v-6 a5 5 0 0 0 -10 0 v6 z M1033 677 a3 3 0 0 0 6 0" />
            <text className="aql-t-step" x="1054" y="673">Alert</text>
          </g>

          <g className="aql-node" id="n-dash" data-node="">
            <rect className="aql-box" x="660" y="880" width="440" height="76" rx="16" />
            <text className="aql-t-title" x="682" y="909">AquaSol app</text>
            <text className="aql-t-tag" x="1080" y="908" textAnchor="end">DASHBOARD</text>
            <circle className="aql-dot" cx="686" cy="934" r="3" />
            <text className="aql-t-item" x="696" y="939">Pest-detected regions</text>
            <circle className="aql-dot" cx="886" cy="934" r="3" />
            <text className="aql-t-item" x="896" y="939">Soil moisture</text>
          </g>

          <g className="aql-node aql-node--cloud" id="n-cloud" data-node="">
            <rect className="aql-box" x="1180" y="300" width="240" height="250" rx="16" />
            <text className="aql-t-title" x="1202" y="333">Cloud</text>
            <text className="aql-t-tag" x="1400" y="332" textAnchor="end">WHEN ONLINE</text>
            {['Analytics, recommendations', 'Big-data handling', 'Model retraining', 'Fault correction', 'Updates to the edge'].map((t, i) => (
              <React.Fragment key={t}>
                <circle className="aql-dot" cx="1206" cy={370 + i * 30} r="3" />
                <text className="aql-t-item" x="1216" y={375 + i * 30}>{t}</text>
              </React.Fragment>
            ))}
          </g>
          <text className="aql-t-item" x="1017" y="325" textAnchor="middle">Readings and sync</text>
          <rect className="aql-pill aql-pill--radio" x="977" y="344" width="80" height="22" rx="11" />
          <text className="aql-t-pill" x="1017" y="359" textAnchor="middle">Wi-Fi</text>
          <text className="aql-t-item" x="1017" y="398" textAnchor="middle">Model updates, fault fixes</text>
          <text className="aql-t-item" x="1290" y="760" textAnchor="end">Analytics and</text>
          <text className="aql-t-item" x="1290" y="779" textAnchor="end">recommendations</text>

          {TRACED.map((e) => (
            <circle key={e.id} className="aql-packet" data-packet={e.id} r="5" />
          ))}
        </g>
      </svg>
    </div>
  );
};
