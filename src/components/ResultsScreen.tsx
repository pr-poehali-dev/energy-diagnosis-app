import { useEffect, useState, useRef } from 'react';
import type { Answer, EnergyType } from './QuizScreen';
import Icon from '@/components/ui/icon';

interface ResultsScreenProps {
  answers: Answer[];
  onRestart: () => void;
}

const ENERGY_KEYS: EnergyType[] = ['physical', 'psychic', 'egregor'];

const ENERGY_META: Record<EnergyType, { label: string; color: string; icon: string; questions: number[]; charge: string }> = {
  physical: {
    label: 'Физическая',
    color: 'hsl(195, 80%, 55%)',
    icon: '⚡',
    questions: [0, 1, 2, 3],
    charge: 'Сон 8ч, движение, питание',
  },
  psychic: {
    label: 'Психическая',
    color: 'hsl(270, 70%, 65%)',
    icon: '🔮',
    questions: [4, 5, 6, 7],
    charge: 'Медитация, тишина, рефлексия',
  },
  egregor: {
    label: 'Эгрегора',
    color: 'hsl(340, 70%, 60%)',
    icon: '✦',
    questions: [8, 9, 10, 11],
    charge: 'Живое общение, практики, ритуалы',
  },
};

const PERCENT_TO_POINTS: Record<number, number> = {
  20: 50,
  50: 125,
  80: 200,
  100: 250,
};

function calcEnergy(answers: Answer[], indices: number[]): number {
  let sum = 0;
  for (const i of indices) {
    const a = answers[i];
    if (!a || a.level === 'neutral') continue;
    const pts = PERCENT_TO_POINTS[a.percent ?? 0] ?? 0;
    sum += a.level === 'good' ? pts : -pts;
  }
  const raw = Math.round((sum + 800) * (1000 / 1600));
  return Math.max(0, Math.min(1000, raw));
}

function getLevel(score: number): { label: string; color: string } {
  if (score <= 332) return { label: 'Низкий уровень', color: 'hsl(0, 70%, 55%)' };
  if (score <= 665) return { label: 'Средний уровень', color: 'hsl(42, 90%, 55%)' };
  return { label: 'Высокий уровень', color: 'hsl(130, 60%, 50%)' };
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{value}</>;
}

// ── Trinity SVG Diagram ──
function TrinityDiagram({ scores }: { scores: Record<EnergyType, number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);

  const colorPhysical = 'hsl(195,80%,55%)';
  const colorPsychic = 'hsl(270,70%,65%)';
  const colorEgregor = 'hsl(340,70%,60%)';

  // Normalize 0-1000 to 0-1
  const p = scores.physical / 1000;
  const ps = scores.psychic / 1000;
  const eg = scores.egregor / 1000;

  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 90; // max radius of each circle
  const OFFSET = 44; // how far each circle center is from CX,CY

  // Three circle centers arranged in equilateral triangle
  const centers = [
    { x: CX,              y: CY - OFFSET,       r: R * p,  color: colorPsychic,  label: '🔮', name: 'Психическая',  key: 'psychic' as EnergyType },
    { x: CX - OFFSET * 0.87, y: CY + OFFSET * 0.5, r: R * p,  color: colorPhysical, label: '⚡', name: 'Физическая',   key: 'physical' as EnergyType },
    { x: CX + OFFSET * 0.87, y: CY + OFFSET * 0.5, r: R * eg, color: colorEgregor,  label: '✦', name: 'Эгрегора',     key: 'egregor' as EnergyType },
  ];

  // Override proper radii
  const radii = { psychic: R * ps, physical: R * p, egregor: R * eg };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    let startTime: number | null = null;
    const duration = 1400;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, SIZE, SIZE);

      const circleData = [
        { cx: CX, cy: CY - OFFSET, r: radii.psychic * ease, color: colorPsychic, hex: '#9d6edf' },
        { cx: CX - OFFSET * 0.87, cy: CY + OFFSET * 0.5, r: radii.physical * ease, color: colorPhysical, hex: '#38bcd4' },
        { cx: CX + OFFSET * 0.87, cy: CY + OFFSET * 0.5, r: radii.egregor * ease, color: colorEgregor, hex: '#d94e7c' },
      ];

      // Draw glow shadows
      ctx.globalCompositeOperation = 'source-over';
      for (const c of circleData) {
        if (c.r < 2) continue;
        const grad = ctx.createRadialGradient(c.cx, c.cy, 0, c.cx, c.cy, c.r + 20);
        grad.addColorStop(0, c.hex + '18');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.r + 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw filled circles with transparency (allows overlap to show)
      ctx.globalCompositeOperation = 'source-over';
      for (const c of circleData) {
        if (c.r < 2) continue;
        const grad = ctx.createRadialGradient(c.cx, c.cy, 0, c.cx, c.cy, c.r);
        grad.addColorStop(0, c.hex + 'aa');
        grad.addColorStop(0.6, c.hex + '66');
        grad.addColorStop(1, c.hex + '22');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw circle strokes
      for (const c of circleData) {
        if (c.r < 2) continue;
        ctx.strokeStyle = c.hex + 'cc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center glow where all three meet
      if (p > 0 && ps > 0 && eg > 0) {
        const centerGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 24 * ease);
        centerGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
        centerGrad.addColorStop(0.5, 'rgba(220,200,255,0.15)');
        centerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(CX, CY, 24 * ease, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) requestAnimationFrame(draw);
      else setAnimated(true);
    };

    requestAnimationFrame(draw);
  }, [p, ps, eg]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE }}
        className="block"
      />
      {/* Labels positioned around */}
      <div className="absolute inset-0 pointer-events-none" style={{ width: SIZE, height: SIZE }}>
        {/* Psychic — top */}
        <div className="absolute flex flex-col items-center" style={{ top: 10, left: '50%', transform: 'translateX(-50%)' }}>
          <span className="font-body text-xs font-semibold" style={{ color: colorPsychic }}>🔮 Психическая</span>
          <span className="font-display text-lg font-light" style={{ color: 'hsl(240,10%,90%)' }}>
            {animated ? scores.psychic : <AnimatedNumber target={scores.psychic} />}
          </span>
        </div>
        {/* Physical — bottom left */}
        <div className="absolute flex flex-col items-end" style={{ bottom: 16, left: 0 }}>
          <span className="font-body text-xs font-semibold" style={{ color: colorPhysical }}>⚡ Физическая</span>
          <span className="font-display text-lg font-light" style={{ color: 'hsl(240,10%,90%)' }}>
            {animated ? scores.physical : <AnimatedNumber target={scores.physical} />}
          </span>
        </div>
        {/* Egregor — bottom right */}
        <div className="absolute flex flex-col items-start" style={{ bottom: 16, right: 0 }}>
          <span className="font-body text-xs font-semibold" style={{ color: colorEgregor }}>✦ Эгрегора</span>
          <span className="font-display text-lg font-light" style={{ color: 'hsl(240,10%,90%)' }}>
            {animated ? scores.egregor : <AnimatedNumber target={scores.egregor} />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResultsScreen({ answers, onRestart }: ResultsScreenProps) {
  const scores = {
    physical: calcEnergy(answers, ENERGY_META.physical.questions),
    psychic: calcEnergy(answers, ENERGY_META.psychic.questions),
    egregor: calcEnergy(answers, ENERGY_META.egregor.questions),
  };
  const total = scores.physical + scores.psychic + scores.egregor;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(270,60%,20%) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.2 }}
      />

      <div className="max-w-lg w-full">

        {/* ── HEADER ── */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p className="font-body text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'hsl(270,60%,65%)' }}>
            Ваши результаты
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-2" style={{ color: 'hsl(240,10%,95%)' }}>
            Диагностика{' '}
            <span className="italic" style={{
              background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>завершена</span>
          </h2>
        </div>

        {/* ── TRINITY DIAGRAM ── */}
        <div
          className="animate-fade-in-up-delay-1 rounded-3xl p-6 mb-6 relative overflow-hidden"
          style={{ background: 'hsl(240,15%,7%)', border: '1px solid hsl(240,15%,14%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 50%, hsl(270,60%,12%) 0%, transparent 70%)',
            opacity: 0.5,
          }} />
          <div className="relative">
            <p className="font-body text-xs tracking-widest uppercase text-center mb-1" style={{ color: 'hsl(240,10%,35%)' }}>
              Триединство энергий
            </p>
            <p className="font-body text-xs text-center mb-5" style={{ color: 'hsl(240,10%,45%)' }}>
              Пересечение кругов — зона вашей общей силы
            </p>

            <div className="flex justify-center">
              <TrinityDiagram scores={scores} />
            </div>

            <div className="text-center mt-4">
              <p className="font-body text-xs mb-1" style={{ color: 'hsl(240,10%,40%)' }}>Общий результат</p>
              <div className="font-display text-5xl font-light" style={{
                background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                <AnimatedNumber target={total} duration={1400} />
              </div>
              <p className="font-body text-sm mt-1" style={{ color: 'hsl(240,10%,35%)' }}>из 3000</p>
            </div>
          </div>
        </div>

        {/* ── ENERGY BARS ── */}
        <div className="space-y-3 mb-6">
          {ENERGY_KEYS.map((key, i) => {
            const meta = ENERGY_META[key];
            const score = scores[key];
            const level = getLevel(score);
            const barWidth = (score / 1000) * 100;
            return (
              <div
                key={key}
                className="rounded-2xl p-5 animate-screen-in"
                style={{
                  animationDelay: `${0.2 + i * 0.15}s`,
                  animationFillMode: 'both',
                  background: 'hsl(240,15%,7%)',
                  border: `1px solid ${meta.color}22`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                      style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}33` }}>
                      {meta.icon}
                    </div>
                    <div>
                      <div className="font-body font-semibold text-sm" style={{ color: meta.color }}>{meta.label}</div>
                      <div className="font-body text-xs" style={{ color: level.color }}>{level.label}</div>
                    </div>
                  </div>
                  <div className="font-display text-3xl font-light" style={{ color: 'hsl(240,10%,90%)' }}>
                    <AnimatedNumber target={score} duration={1000 + i * 200} />
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(240,15%,14%)' }}>
                  <div className="h-full rounded-full energy-bar-fill"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                      boxShadow: `0 0 8px ${meta.color}66`,
                      animationDelay: `${0.4 + i * 0.15}s`,
                    }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-body text-xs" style={{ color: 'hsl(0,70%,50%)' }}>0</span>
                  <span className="font-body text-xs" style={{ color: 'hsl(240,10%,30%)' }}>500</span>
                  <span className="font-body text-xs" style={{ color: 'hsl(130,60%,45%)' }}>1000</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DAILY CHARGE BLOCK ── */}
        <div
          className="rounded-3xl overflow-hidden mb-6 animate-screen-in"
          style={{
            animationDelay: '0.6s',
            animationFillMode: 'both',
            background: 'hsl(240,15%,7%)',
            border: '1px solid hsl(270,40%,22%)',
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-4"
            style={{ borderBottom: '1px solid hsl(240,15%,12%)' }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'hsl(270,60%,20%)', border: '1px solid hsl(270,60%,35%)' }}
              >
                🔋
              </div>
              <div>
                <div className="font-body text-xs tracking-widest uppercase" style={{ color: 'hsl(270,60%,55%)' }}>Главный инсайт</div>
                <div className="font-display text-xl font-light" style={{ color: 'hsl(240,10%,92%)' }}>
                  Заряжайтесь каждый день
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,65%)' }}>
              Вы не можете <span style={{ color: 'hsl(240,10%,85%)', fontWeight: 500 }}>один раз зарядить телефон и пользоваться им вечно</span>. 
              Точно так же работает и ваша энергия — она расходуется каждый день и требует ежедневного восполнения. 
              Это не слабость. Это закон природы.
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,55%)' }}>
              Все три потока нужно питать осознанно и регулярно. Пропустили день — уровень упал. 
              Пропустили неделю — система начинает давать сбои. Именно поэтому <span style={{ color: 'hsl(240,10%,75%)', fontWeight: 500 }}>ресурс — это не состояние, а практика</span>.
            </p>

            {/* Charge cards */}
            <div className="space-y-2 pt-1">
              {ENERGY_KEYS.map((key) => {
                const meta = ENERGY_META[key];
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: `${meta.color}0c`, border: `1px solid ${meta.color}20` }}
                  >
                    <span className="text-base">{meta.icon}</span>
                    <div>
                      <span className="font-body text-xs font-semibold mr-2" style={{ color: meta.color }}>
                        {meta.label}:
                      </span>
                      <span className="font-body text-xs" style={{ color: 'hsl(240,10%,55%)' }}>
                        {meta.charge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: 'hsl(270,40%,12%)', border: '1px solid hsl(270,40%,22%)' }}
            >
              <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,70%)' }}>
                Когда все три потока заряжены — вы непобедимы. Вы думаете ясно, чувствуете устойчивость 
                и действуете с силой, которую поддерживает окружение.{' '}
                <span style={{ color: 'hsl(240,10%,88%)', fontWeight: 500 }}>Это и есть ресурсное состояние.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="space-y-3 animate-screen-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <a
            href="https://t.me/+WBzx-fV2Flo2ZDNi"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-8 rounded-2xl font-body font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(270,60%,45%), hsl(200,70%,40%))',
              color: 'hsl(240,10%,95%)',
              border: '1px solid hsl(270,60%,55%)',
              boxShadow: '0 0 24px hsl(270,60%,20%), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Icon name="Send" size={18} />
            Управлять Энергией
          </a>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl font-body text-sm transition-all duration-200 hover:scale-[1.01]"
            style={{ background: 'transparent', border: '1px solid hsl(240,15%,18%)', color: 'hsl(240,10%,40%)' }}
          >
            Пройти заново
          </button>
        </div>

      </div>
    </div>
  );
}
