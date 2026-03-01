import { useEffect, useState } from 'react';
import type { Answer, EnergyType } from './QuizScreen';
import Icon from '@/components/ui/icon';

interface ResultsScreenProps {
  answers: Answer[];
  onRestart: () => void;
}

const ENERGY_KEYS: EnergyType[] = ['physical', 'psychic', 'egregor'];

const ENERGY_META: Record<EnergyType, { label: string; color: string; icon: string; questions: number[] }> = {
  physical: {
    label: 'Физическая',
    color: 'hsl(195, 80%, 55%)',
    icon: '⚡',
    questions: [0, 1, 2, 3],
  },
  psychic: {
    label: 'Психическая',
    color: 'hsl(270, 70%, 65%)',
    icon: '🔮',
    questions: [4, 5, 6, 7],
  },
  egregor: {
    label: 'Эгрегора',
    color: 'hsl(340, 70%, 60%)',
    icon: '✦',
    questions: [8, 9, 10, 11],
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

export default function ResultsScreen({ answers, onRestart }: ResultsScreenProps) {
  const scores = {
    physical: calcEnergy(answers, ENERGY_META.physical.questions),
    psychic: calcEnergy(answers, ENERGY_META.psychic.questions),
    egregor: calcEnergy(answers, ENERGY_META.egregor.questions),
  };

  const total = scores.physical + scores.psychic + scores.egregor;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(270,60%,20%) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 0.2 }}
      />

      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="font-body text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'hsl(270,60%,65%)' }}>
            Ваши результаты
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-2" style={{ color: 'hsl(240,10%,95%)' }}>
            Диагностика<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>завершена</span>
          </h2>
        </div>

        {/* Total score */}
        <div className="animate-fade-in-up-delay-1 text-center mb-8 rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'hsl(240,15%,7%)', border: '1px solid hsl(240,15%,14%)' }}
        >
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 100%, hsl(270,60%,15%) 0%, transparent 70%)',
            opacity: 0.4
          }} />
          <div className="relative">
            <p className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(240,10%,40%)' }}>
              Общий результат
            </p>
            <div className="font-display text-6xl md:text-7xl font-light mb-1" style={{
              background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <AnimatedNumber target={total} duration={1400} />
            </div>
            <p className="font-body text-sm" style={{ color: 'hsl(240,10%,40%)' }}>из 3000</p>

            {/* Distribution bar */}
            <div className="mt-4 flex h-2 rounded-full overflow-hidden gap-0.5">
              {ENERGY_KEYS.map((key) => {
                const meta = ENERGY_META[key];
                const width = total > 0 ? (scores[key] / total) * 100 : 33.33;
                return (
                  <div
                    key={key}
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${width}%`,
                      background: meta.color,
                      boxShadow: `0 0 8px ${meta.color}88`,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {ENERGY_KEYS.map((key) => (
                <span key={key} className="font-body text-xs" style={{ color: ENERGY_META[key].color }}>
                  {ENERGY_META[key].icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Energy cards */}
        <div className="space-y-3 mb-8">
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
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                      style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}33` }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <div className="font-body font-semibold text-sm" style={{ color: meta.color }}>
                        {meta.label}
                      </div>
                      <div className="font-body text-xs" style={{ color: level.color }}>
                        {level.label}
                      </div>
                    </div>
                  </div>
                  <div className="font-display text-3xl font-light" style={{ color: 'hsl(240,10%,90%)' }}>
                    <AnimatedNumber target={score} duration={1000 + i * 200} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(240,15%,14%)' }}>
                  <div
                    className="h-full rounded-full energy-bar-fill"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                      boxShadow: `0 0 8px ${meta.color}66`,
                      animationDelay: `${0.4 + i * 0.15}s`,
                    }}
                  />
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

        {/* CTA */}
        <div className="space-y-3 animate-fade-in-up-delay-4">
          <a
            href="https://t.me/+WBzx-fV2Flo2ZDNi"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-8 rounded-2xl font-body font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
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
            style={{
              background: 'transparent',
              border: '1px solid hsl(240,15%,18%)',
              color: 'hsl(240,10%,40%)',
            }}
          >
            Пройти заново
          </button>
        </div>
      </div>
    </div>
  );
}
