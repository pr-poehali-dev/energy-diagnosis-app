import Icon from '@/components/ui/icon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const energyTypes = [
  {
    icon: '⚡',
    name: 'Физическая',
    color: 'hsl(195, 80%, 55%)',
    colorDim: 'hsl(195, 80%, 55%)',
    delay: 'animate-fade-in-up-delay-2',
    what: 'Фундамент всего существования',
    desc: 'Это топливо вашего тела — энергия, которая позволяет вам двигаться, работать и восстанавливаться. Без неё даже самые яркие идеи остаются нереализованными: тело просто не справляется с нагрузкой.',
    why: 'Когда физическая энергия низкая, страдает всё — мышление становится туманным, эмоции выходят из-под контроля, а связи с людьми слабеют. Тело — это сосуд, который нужно наполнять каждый день.',
    signs: ['Качество сна и пробуждения', 'Желание двигаться и действовать', 'Физическая выносливость'],
  },
  {
    icon: '🔮',
    name: 'Психическая',
    color: 'hsl(270, 70%, 65%)',
    colorDim: 'hsl(270, 70%, 65%)',
    delay: 'animate-fade-in-up-delay-3',
    what: 'Центр управления вашей реальностью',
    desc: 'Это ваш внутренний мир — мысли, эмоции, концентрация и ментальная ясность. Психическая энергия определяет, как вы воспринимаете мир вокруг и принимаете решения в ключевые моменты.',
    why: 'Когда эта энергия истощена, приходят тревога, выгорание и ощущение потери смысла. Именно она даёт вам силу оставаться собой в любых обстоятельствах и видеть возможности там, где другие видят преграды.',
    signs: ['Эмоциональный баланс', 'Концентрация и ясность мышления', 'Устойчивость к стрессу'],
  },
  {
    icon: '✦',
    name: 'Эгрегора',
    color: 'hsl(340, 70%, 60%)',
    colorDim: 'hsl(340, 70%, 60%)',
    delay: 'animate-fade-in-up-delay-4',
    what: 'Невидимая сила коллективного поля',
    desc: 'Это энергия, которую вы черпаете из своего окружения — от людей, разделяющих ваши ценности, от сообществ, ритуалов и коллективных практик. Человек не остров: мы усиливаем или ослабляем друг друга.',
    why: 'Правильное окружение умножает вашу силу в разы. Токсичная среда незаметно опустошает даже самых сильных. Энергия эгрегора — это то, почему великие дела делаются командами, а не одиночками.',
    signs: ['Качество окружения', 'Ощущение поддержки и принятия', 'Участие в коллективных практиках'],
  },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16 relative z-10">
      {/* Decorative orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 energy-orb pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(270,70%,65%) 0%, transparent 70%)', opacity: 0.1 }} />
      <div className="fixed bottom-1/3 right-1/4 w-48 h-48 energy-orb pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(195,80%,55%) 0%, transparent 70%)', opacity: 0.08, animationDelay: '2s' }} />
      <div className="fixed top-2/3 right-1/3 w-40 h-40 energy-orb pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(340,70%,60%) 0%, transparent 70%)', opacity: 0.08, animationDelay: '4s' }} />

      <div className="max-w-lg w-full">

        {/* ── HERO ── */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative">
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, hsl(270,60%,30%) 0%, transparent 70%)', filter: 'blur(12px)' }} />
            <span className="relative text-5xl" style={{ filter: 'drop-shadow(0 0 20px hsl(270,70%,65%))' }}>◈</span>
          </div>

          <p className="font-body text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'hsl(270,60%,65%)' }}>
            Персональная диагностика
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-5" style={{ color: 'hsl(240,10%,95%)' }}>
            Диагностика<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, hsl(195,80%,65%), hsl(270,70%,70%), hsl(340,70%,65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Энергии</span>
          </h1>

          {/* Trinity concept */}
          <div
            className="rounded-2xl px-6 py-5 text-left"
            style={{ background: 'hsl(240,15%,7%)', border: '1px solid hsl(240,15%,14%)' }}
          >
            <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,65%)' }}>
              Ваша жизненная сила — это не одно целое, а{' '}
              <span style={{ color: 'hsl(240,10%,85%)', fontWeight: 500 }}>три неразрывно связанных потока</span>.
              Они питают друг друга и вместе создают то, что мы называем{' '}
              <span style={{ color: 'hsl(240,10%,85%)', fontWeight: 500 }}>ресурсным состоянием</span>.
              Нельзя быть по-настоящему в ресурсе, если хотя бы один поток пересох.
            </p>
          </div>
        </div>

        {/* ── ENERGY CARDS ── */}
        <div className="space-y-5 mb-14">
          {energyTypes.map((e, i) => (
            <div
              key={e.name}
              className={`${e.delay} rounded-3xl overflow-hidden`}
              style={{
                background: 'hsl(240,15%,7%)',
                border: `1px solid ${e.color}22`,
              }}
            >
              {/* Card header */}
              <div
                className="px-6 pt-6 pb-4 flex items-start gap-4"
                style={{ borderBottom: `1px solid ${e.color}15` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl mt-0.5"
                  style={{ background: `${e.color}18`, border: `1px solid ${e.color}33`, boxShadow: `0 0 16px ${e.color}22` }}
                >
                  {e.icon}
                </div>
                <div>
                  <div className="font-body font-semibold text-sm tracking-wide mb-0.5" style={{ color: e.color }}>
                    {e.name} энергия
                  </div>
                  <div className="font-display text-xl font-light leading-snug" style={{ color: 'hsl(240,10%,90%)' }}>
                    {e.what}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-5 space-y-4">
                <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,62%)' }}>
                  {e.desc}
                </p>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,55%)' }}>
                  {e.why}
                </p>

                {/* Signs */}
                <div className="pt-1">
                  <p className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'hsl(240,10%,35%)' }}>
                    Что диагностируем
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {e.signs.map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs px-3 py-1 rounded-full"
                        style={{ background: `${e.color}12`, border: `1px solid ${e.color}28`, color: e.color }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── UNITY BLOCK ── */}
        <div
          className="animate-fade-in-up-delay-4 rounded-3xl p-6 mb-10 relative overflow-hidden"
          style={{ background: 'hsl(240,15%,7%)', border: '1px solid hsl(270,40%,25%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, hsl(270,60%,15%) 0%, transparent 70%)',
            opacity: 0.5
          }} />
          <div className="relative text-center">
            {/* Mini trinity visual */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {energyTypes.map((e, i) => (
                <div key={e.name} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ background: `${e.color}20`, border: `1px solid ${e.color}44`, boxShadow: `0 0 12px ${e.color}33` }}
                  >
                    {e.icon}
                  </div>
                  {i < 2 && <div className="w-6 h-px" style={{ background: `linear-gradient(90deg, ${e.color}44, ${energyTypes[i+1].color}44)` }} />}
                </div>
              ))}
            </div>
            <p className="font-display text-xl font-light mb-2" style={{ color: 'hsl(240,10%,90%)' }}>
              Три — единое целое
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(240,10%,55%)' }}>
              Общая энергия неотделима от каждой из трёх составляющих. Усильте одну — подтянутся остальные.
              Истощите одну — пострадает вся система. Диагностика покажет, где ваше слабое звено.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="animate-fade-in-up-delay-4 text-center">
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
