import { useState } from 'react';
import Icon from '@/components/ui/icon';

export type EnergyType = 'physical' | 'psychic' | 'egregor';

export interface Question {
  id: number;
  text: string;
  energy: EnergyType;
}

export interface Answer {
  level: 'bad' | 'neutral' | 'good' | null;
  percent: number | null;
}

const QUESTIONS: Question[] = [
  { id: 1, text: 'Как вы оцениваете свою физическую усталость в последние дни?', energy: 'physical' },
  { id: 2, text: 'Насколько легко вам просыпаться и вставать по утрам?', energy: 'physical' },
  { id: 3, text: 'Есть ли у вас желание и силы для физической активности?', energy: 'physical' },
  { id: 4, text: 'Как вы оцениваете качество своего сна?', energy: 'physical' },
  { id: 5, text: 'Чувствуете ли вы эмоциональное выгорание или опустошённость?', energy: 'psychic' },
  { id: 6, text: 'Насколько вам легко сосредоточиться на важных задачах?', energy: 'psychic' },
  { id: 7, text: 'Как часто вас охватывает тревога или беспокойство?', energy: 'psychic' },
  { id: 8, text: 'Довольны ли вы своим эмоциональным состоянием в целом?', energy: 'psychic' },
  { id: 9, text: 'Чувствуете ли вы связь с людьми, разделяющими ваши ценности?', energy: 'egregor' },
  { id: 10, text: 'Ощущаете ли вы поддержку и ресурс от своего окружения?', energy: 'egregor' },
  { id: 11, text: 'Участвуете ли вы в коллективных практиках, ритуалах или группах?', energy: 'egregor' },
  { id: 12, text: 'Влияет ли ваша группа на вас позитивно при принятии решений?', energy: 'egregor' },
];

const PERCENT_OPTIONS = [20, 50, 80, 100];

const ENERGY_LABELS: Record<EnergyType, { label: string; color: string; icon: string }> = {
  physical: { label: 'Физическая', color: 'hsl(195, 80%, 55%)', icon: '⚡' },
  psychic: { label: 'Психическая', color: 'hsl(270, 70%, 65%)', icon: '🔮' },
  egregor: { label: 'Эгрегора', color: 'hsl(340, 70%, 60%)', icon: '✦' },
};

interface QuizScreenProps {
  onComplete: (answers: Answer[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    QUESTIONS.map(() => ({ level: null, percent: null }))
  );
  const [animating, setAnimating] = useState(false);

  const question = QUESTIONS[current];
  const answer = answers[current];
  const energy = ENERGY_LABELS[question.energy];
  const progress = ((current) / QUESTIONS.length) * 100;
  const isLast = current === QUESTIONS.length - 1;

  const isComplete = answer.level === 'neutral' || (answer.level !== null && answer.percent !== null);

  const setLevel = (level: 'bad' | 'neutral' | 'good') => {
    const updated = [...answers];
    if (level === 'neutral') {
      updated[current] = { level: 'neutral', percent: 0 };
    } else {
      updated[current] = { level, percent: null };
    }
    setAnswers(updated);
  };

  const setPercent = (percent: number) => {
    const updated = [...answers];
    updated[current] = { ...answers[current], percent };
    setAnswers(updated);
  };

  const goNext = () => {
    if (!isComplete || animating) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setAnimating(false);
    }, 350);
  };

  const goPrev = () => {
    if (current === 0 || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => c - 1);
      setAnimating(false);
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
      {/* Decorative orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${energy.color}15 0%, transparent 70%)`,
          filter: 'blur(40px)',
          transition: 'background 0.8s ease',
        }}
      />

      <div className="max-w-lg w-full relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 disabled:opacity-20 disabled:pointer-events-none"
            style={{ background: 'hsl(240,15%,10%)', border: '1px solid hsl(240,15%,18%)' }}
          >
            <Icon name="ChevronLeft" size={18} style={{ color: 'hsl(240,10%,70%)' }} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg">{energy.icon}</span>
            <span className="font-body text-xs tracking-widest uppercase" style={{ color: energy.color }}>
              {energy.label}
            </span>
          </div>

          <div className="font-body text-sm" style={{ color: 'hsl(240,10%,45%)' }}>
            {current + 1}<span style={{ color: 'hsl(240,10%,30%)' }}>/{QUESTIONS.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 animate-fade-in-up">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(240,15%,12%)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${energy.color}, ${energy.color}99)`,
                boxShadow: `0 0 8px ${energy.color}66`,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          key={current}
          className="animate-screen-in rounded-3xl p-7 mb-6"
          style={{
            background: 'hsl(240,15%,7%)',
            border: `1px solid ${energy.color}22`,
            boxShadow: `0 0 40px ${energy.color}08`,
          }}
        >
          <p className="font-display text-2xl md:text-3xl font-light leading-snug mb-8" style={{ color: 'hsl(240,10%,92%)' }}>
            {question.text}
          </p>

          {/* Level buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(
              [
                { key: 'bad', label: 'Плохо', icon: '↓', hue: 0 },
                { key: 'neutral', label: 'Нейтрально', icon: '—', hue: 45 },
                { key: 'good', label: 'Хорошо', icon: '↑', hue: 130 },
              ] as const
            ).map(({ key, label, icon, hue }) => {
              const isSelected = answer.level === key;
              return (
                <button
                  key={key}
                  onClick={() => setLevel(key)}
                  className="py-3 px-2 rounded-2xl font-body text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex flex-col items-center gap-1"
                  style={{
                    background: isSelected
                      ? key === 'neutral'
                        ? `hsl(${hue},0%,30%)`
                        : `hsl(${hue},50%,20%)`
                      : 'hsl(240,15%,11%)',
                    border: isSelected
                      ? key === 'neutral'
                        ? `1.5px solid hsl(${hue},0%,45%)`
                        : `1.5px solid hsl(${hue},60%,45%)`
                      : '1.5px solid hsl(240,15%,16%)',
                    color: isSelected
                      ? key === 'neutral'
                        ? 'hsl(45,0%,80%)'
                        : `hsl(${hue},70%,70%)`
                      : 'hsl(240,10%,50%)',
                    boxShadow: isSelected && key !== 'neutral'
                      ? `0 0 16px hsl(${hue},60%,30%)`
                      : 'none',
                  }}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Percent buttons */}
          {answer.level && answer.level !== 'neutral' && (
            <div className="animate-screen-in">
              <p className="font-body text-xs text-center mb-3 tracking-wider uppercase" style={{ color: 'hsl(240,10%,40%)' }}>
                Насколько {answer.level === 'bad' ? 'плохо' : 'хорошо'}?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PERCENT_OPTIONS.map((p) => {
                  const isSelected = answer.percent === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPercent(p)}
                      className="py-2.5 rounded-xl font-body text-sm font-semibold transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
                      style={{
                        background: isSelected ? energy.color : 'hsl(240,15%,11%)',
                        border: isSelected ? `1.5px solid ${energy.color}` : '1.5px solid hsl(240,15%,18%)',
                        color: isSelected ? 'hsl(240,20%,8%)' : 'hsl(240,10%,55%)',
                        boxShadow: isSelected ? `0 0 16px ${energy.color}66` : 'none',
                      }}
                    >
                      {p}%
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={!isComplete}
          className="w-full py-4 rounded-2xl font-body font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isComplete
              ? `linear-gradient(135deg, ${energy.color}cc, ${energy.color}88)`
              : 'hsl(240,15%,11%)',
            color: isComplete ? 'hsl(240,20%,8%)' : 'hsl(240,10%,40%)',
            border: isComplete ? `1px solid ${energy.color}` : '1px solid hsl(240,15%,18%)',
            boxShadow: isComplete ? `0 0 20px ${energy.color}44, 0 4px 20px rgba(0,0,0,0.4)` : 'none',
          }}
        >
          {isLast ? 'Узнать результат ✦' : 'Далее →'}
        </button>
      </div>
    </div>
  );
}

export { QUESTIONS };
