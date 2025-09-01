

import React, { useState, useMemo, useCallback } from 'react';
import { Flashcard, Mode, BloomLevel, Language, DifficultyMix } from './types';
import { generateFlashcardsFromTopic, defineTerms } from './services/geminiService';
import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import TopicModeForm from './components/TopicModeForm';
import PairsModeForm from './components/PairsModeForm';
import ActionButtons from './components/ActionButtons';
import ErrorDisplay from './components/ErrorDisplay';
import CardGrid from './components/CardGrid';
import PromptingTips from './components/PromptingTips';
import Footer from './components/Footer';

export default function App() {
  const [mode, setMode] = useState<Mode>('topic');
  const [topic, setTopic] = useState('');
  const [pairsText, setPairsText] = useState('');
  const [count, setCount] = useState(10);
  const [lang, setLang] = useState<Language>(Language.English);
  const [includeHint, setIncludeHint] = useState(true);
  const [includeExample, setIncludeExample] = useState(true);
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>(BloomLevel.Understand);
  const [difficultyMix, setDifficultyMix] = useState<DifficultyMix>({ easy: 40, medium: 40, hard: 20 });
  const [temperature, setTemperature] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);

  const totalMix = difficultyMix.easy + difficultyMix.medium + difficultyMix.hard;
  const isMixWarning = totalMix !== 100;

  const canGenerate = useMemo(() => {
    if (loading) return false;
    if (mode === 'topic') return topic.trim().length > 2;
    if (mode === 'pairs') return pairsText.trim().length > 2;
    return false;
  }, [loading, mode, topic, pairsText]);

  const parsePairs = (text: string): Omit<Flashcard, 'id'>[] => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return lines.map((line) => {
      let term = '';
      let definition = '';
      // FIX: Correctly parse term/definition pairs. The original code had syntax errors
      // from invalid destructuring and a logic bug related to string parsing. This version
      // correctly splits the string at the first delimiter.
      if (line.includes(':')) {
        const idx = line.indexOf(':');
        term = line.substring(0, idx).trim();
        definition = line.substring(idx + 1).trim();
      } else if (line.includes('-')) {
        const idx = line.indexOf('-');
        term = line.substring(0, idx).trim();
        definition = line.substring(idx + 1).trim();
      } else if (line.includes(',')) {
        const idx = line.indexOf(',');
        term = line.substring(0, idx).trim();
        definition = line.substring(idx + 1).trim();
      } else {
        term = line.trim();
        definition = '';
      }
      return { term, definition, hint: '', example: '', difficulty: 'medium' };
    });
  };

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError('');
    setCards([]);

    try {
      if (mode === 'pairs') {
        const parsed = parsePairs(pairsText);
        const termsWithoutDefs = parsed.filter((p) => !p.definition).map((p) => p.term);
        let enrichedCards = parsed;

        if (termsWithoutDefs.length > 0) {
          const defined = await defineTerms(termsWithoutDefs, lang);
          const definitionMap = new Map(defined.map((d) => [d.term.toLowerCase(), d.definition]));
          enrichedCards = parsed.map((card) => 
            card.definition ? card : { ...card, definition: definitionMap.get(card.term.toLowerCase()) || '' }
          );
        }
        setCards(enrichedCards.filter(c => c.definition).map((c, index) => ({...c, id: index})));

      } else {
        const options = {
          topic,
          count,
          lang,
          includeHint,
          includeExample,
          bloomLevel,
          difficultyMix: isMixWarning ? { easy: 40, medium: 40, hard: 20 } : difficultyMix,
          temperature,
        };
        const generated = await generateFlashcardsFromTopic(options);
        setCards(generated.map((c, index) => ({...c, id: index})));
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred. Check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [mode, pairsText, topic, count, lang, includeHint, includeExample, bloomLevel, difficultyMix, isMixWarning, temperature]);
  
  const slugify = (s: string) => {
    return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cards";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Header />
        
        <main>
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <ModeSwitcher mode={mode} setMode={setMode} />
          </div>
          
          {mode === 'topic' ? (
            <TopicModeForm
              topic={topic}
              setTopic={setTopic}
              count={count}
              setCount={setCount}
              lang={lang}
              setLang={setLang}
              bloomLevel={bloomLevel}
              setBloomLevel={setBloomLevel}
              includeHint={includeHint}
              setIncludeHint={setIncludeHint}
              includeExample={includeExample}
              setIncludeExample={setIncludeExample}
              temperature={temperature}
              setTemperature={setTemperature}
              difficultyMix={difficultyMix}
              setDifficultyMix={setDifficultyMix}
              isMixWarning={isMixWarning}
            />
          ) : (
            <PairsModeForm pairsText={pairsText} setPairsText={setPairsText} />
          )}

          <ActionButtons
            onGenerate={handleGenerate}
            cards={cards}
            canGenerate={canGenerate}
            loading={loading}
            mode={mode}
            fileNameSlug={slugify(topic || 'pairs')}
          />

          <ErrorDisplay error={error} />

          <CardGrid loading={loading} cards={cards} />

          <PromptingTips />
        </main>

        <Footer />
      </div>
    </div>
  );
}