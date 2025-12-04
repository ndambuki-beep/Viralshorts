import React, { useState } from 'react';
import { Search, Loader2, PlaySquare, Award, Zap, Smile, AlertCircle } from 'lucide-react';
import { findViralContent } from './services/geminiService';
import { SearchResult, QueryType } from './types';
import { AnalysisCard } from './components/AnalysisCard';

const SUGGESTIONS = [
  { label: "Trending AGT", query: QueryType.TRENDING_AGT, icon: <Award className="w-4 h-4" /> },
  { label: "Trending BGT", query: QueryType.TRENDING_BGT, icon: <Award className="w-4 h-4" /> },
  { label: "Golden Buzzers", query: QueryType.GOLDEN_BUZZERS, icon: <Zap className="w-4 h-4" /> },
  { label: "Funny Auditions", query: QueryType.FUNNY_AUDITIONS, icon: <Smile className="w-4 h-4" /> },
  { label: "Shocking Acts", query: QueryType.SHOCKING_MOMENTS, icon: <AlertCircle className="w-4 h-4" /> },
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setQuery(searchQuery);

    try {
      const data = await findViralContent(searchQuery);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch viral insights. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#333] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <PlaySquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ViralTalent <span className="text-red-500">Scout</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
             <span>Powered by Gemini 2.5</span>
             <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
             <span>Real-time Web Search</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Hero / Search Section */}
        <div className={`w-full max-w-3xl text-center transition-all duration-500 ${result ? 'mb-8' : 'my-auto'}`}>
          {!result && (
            <div className="mb-8 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Viral Short</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Discover trending AGT & BGT clips, get AI-driven editing strategies, and grow your channel faster.
              </p>
            </div>
          )}

          <div className="relative group w-full">
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-all opacity-0 group-hover:opacity-100"></div>
            <div className="relative flex items-center bg-[#1f1f1f] border border-[#333] rounded-full overflow-hidden shadow-2xl transition-all focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/20">
              <div className="pl-6 pr-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for 'Golden Buzzer 2024' or 'Viral Magician AGT'..."
                className="w-full bg-transparent py-4 text-lg text-white placeholder-gray-500 focus:outline-none"
              />
              <button 
                onClick={() => handleSearch(query)}
                disabled={loading}
                className="mr-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          {!loading && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSearch(s.query)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] border border-[#333] text-sm font-medium text-gray-300 hover:bg-[#333] hover:text-white hover:border-red-500/30 transition-all"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading && (
          <div className="w-full max-w-4xl mt-12 text-center animate-pulse">
            <div className="h-64 bg-[#1f1f1f] rounded-xl mb-4"></div>
            <p className="text-gray-400">Scouring the web for the latest viral hits...</p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-4xl mt-8 p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg flex items-center gap-3">
             <AlertCircle className="w-5 h-5" />
             {error}
          </div>
        )}

        {!loading && result && (
          <div className="w-full mt-8">
            <AnalysisCard result={result} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] mt-auto py-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} ViralTalent Scout. Not affiliated with AGT or BGT.</p>
          <p className="mt-2">Use these insights to create transformative content under Fair Use policies.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;