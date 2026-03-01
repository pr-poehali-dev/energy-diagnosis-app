import Icon from '@/components/ui/icon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const energyTypes = [
  {
    icon: '⚡',
    name: 'Физическая',
    desc: 'Жизненная сила тела, выносливость и восстановление',
    color: 'hsl(195, 80%, 55%)',
    delay: 'animate-fade-in-up-delay-2',
  },
  {
    icon: '🔮',
    name: 'Психическая',
    desc: 'Ментальная ясность, эмоциональный баланс и концентрация',
    color: 'hsl(270, 70%, 65%)',
    delay: 'animate-fade-in-up-delay-3',
  },
  {
    icon: '✦',
    name: 'Эгрегора',
    desc: 'Связь с коллективом, поддержка окружения и групповая сила',
    color: 'hsl(340, 70%, 60%)',
    delay: 'animate-fade-in-up-delay-4',
  },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 energy-orb" style={{ background: 'radial-gradient(circle, hsl(270,70%,65%) 0%, transparent 70%)', opacity: 0.12 }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 energy-orb" style={{ background: 'radial-gradient(circle, hsl(195,80%,55%) 0%, transparent 70%)', opacity: 0.1, animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 energy-orb" style={{ background: 'radial-gradient(circle, hsl(340,70%,60%) 0%, transparent 70%)', opacity: 0.1, animationDelay: '4s' }} />

      <div className="max-w-lg w-full text-center">
        {/* Symbol */}
        <div className="animate-fade-in-up mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative">
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, hsl(270,60%,30%) 0%, transparent 70%)', filter: 'blur(8px)' }} />
            <span className="relative text-5xl" style={{ filter: 'drop-shadow(0 0 16px hsl(270,70%,65%))' }}>◈</span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up-delay-1">
          <p className="font-body text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'hsl(270,60%,65%)' }}>
            Персональная диагностика
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4" style={{ color: 'hsl(240,10%,95%)' }}>
            Диагностика<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Энергии</span>
          </h1>
          <p className="font-body text-base leading-relaxed mb-10" style={{ color: 'hsl(240,10%,60%)' }}>
            12 вопросов раскроют состояние трёх потоков вашей энергии
          </p>
        </div>

        {/* Energy types */}
        <div className="space-y-3 mb-10">
          {energyTypes.map((e) => (
            <div
              key={e.name}
              className={`${e.delay} flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.01]`}
              style={{
                background: 'hsl(240,15%,8%)',
                border: `1px solid ${e.color}22`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: `${e.color}18`, border: `1px solid ${e.color}33` }}
              >
                {e.icon}
              </div>
              <div>
                <div className="font-body font-600 text-sm mb-0.5" style={{ color: e.color }}>
                  {e.name} энергия
                </div>
                <div className="font-body text-xs leading-snug" style={{ color: 'hsl(240,10%,55%)' }}>
                  {e.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up-delay-4">
          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-2xl font-body font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, hsl(270,60%,45%), hsl(270,60%,35%))',
              color: 'hsl(240,10%,95%)',
              border: '1px solid hsl(270,60%,55%)',
              boxShadow: '0 0 24px hsl(270,60%,25%), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Начать диагностику
              <Icon name="ArrowRight" size={18} />
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, hsl(270,60%,50%), hsl(270,60%,40%))' }}
            />
          </button>
          <p className="font-body text-xs mt-4" style={{ color: 'hsl(240,10%,35%)' }}>
            ≈ 3 минуты · 12 вопросов · Бесплатно
          </p>
        </div>
      </div>
    </div>
  );
}
