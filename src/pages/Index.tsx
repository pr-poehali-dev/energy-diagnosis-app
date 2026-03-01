import { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultsScreen from '@/components/ResultsScreen';
import type { Answer } from '@/components/QuizScreen';

type Screen = 'welcome' | 'quiz' | 'results';

export default function Index() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleStart = () => setScreen('quiz');

  const handleComplete = (ans: Answer[]) => {
    setAnswers(ans);
    setScreen('results');
  };

  const handleRestart = () => {
    setAnswers([]);
    setScreen('welcome');
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'hsl(240, 20%, 4%)' }}>
      {/* Stars background */}
      <div className="stars-bg" />

      {/* Screen transitions */}
      <div key={screen} className="animate-screen-in">
        {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
        {screen === 'quiz' && <QuizScreen onComplete={handleComplete} />}
        {screen === 'results' && <ResultsScreen answers={answers} onRestart={handleRestart} />}
      </div>
    </div>
  );
}
