import React, { useState, useMemo } from 'react';
import { X, Search, Heart, Copy, Check, Share2, Sparkles, BookOpen, ArrowUpRight } from 'lucide-react';
import { Quote, QUOTES_CMS } from '../data/quotes';

interface QuoteArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  onSelectAsCurrentQuote: (quote: Quote) => void;
  initialFilterFavorites?: boolean;
}

export const QuoteArchiveModal: React.FC<QuoteArchiveModalProps> = ({
  isOpen,
  onClose,
  favoriteIds,
  onToggleFavorite,
  onSelectAsCurrentQuote,
  initialFilterFavorites = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilterFavorites ? 'favorites' : 'all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All 365' },
    { id: 'favorites', label: `Favorites (${favoriteIds.length})` },
    { id: 'Morning Calm', label: 'Morning Calm' },
    { id: 'Clarity & Focus', label: 'Clarity & Focus' },
    { id: 'Perseverance', label: 'Perseverance' },
    { id: 'Wisdom', label: 'Wisdom' },
    { id: 'Creativity', label: 'Creativity' },
    { id: 'Mindfulness', label: 'Mindfulness' },
  ];

  const filteredQuotes = useMemo(() => {
    return QUOTES_CMS.filter((q) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favoriteIds.includes(q.id)) return false;
      } else if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.quote.toLowerCase().includes(query) ||
          q.author.toLowerCase().includes(query) ||
          q.category.toLowerCase().includes(query) ||
          String(q.id) === query
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, favoriteIds]);

  const handleCopy = (q: Quote) => {
    navigator.clipboard.writeText(`"${q.quote}" — ${q.author} (via AuraDay)`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">365-Day Quote Archive</h2>
              <p className="text-xs text-slate-400">
                A year of daily contemplation, wisdom, and mental clarity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/40 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search quotes by author, keywords, or day number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quote List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
            <span>Showing {filteredQuotes.length} thoughts</span>
            {selectedCategory === 'favorites' && favoriteIds.length === 0 && (
              <span className="text-rose-400">No favorited quotes yet. Tap the heart on any card to save it!</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.map((q) => {
              const isFav = favoriteIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  className="rounded-2xl p-5 border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-500">Day {q.id}</span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="text-[11px] uppercase tracking-wider">{q.category}</span>
                      </div>

                      <button
                        onClick={() => onToggleFavorite(q.id)}
                        className={`p-1.5 rounded-lg transition ${
                          isFav
                            ? 'text-rose-500 bg-rose-500/15'
                            : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* The Quote */}
                    <p className="font-serif-quote text-base sm:text-lg leading-relaxed text-slate-100">
                      “{q.quote}”
                    </p>

                    {/* Author */}
                    <p className="text-xs font-semibold text-slate-300 mt-3">
                      — {q.author}
                    </p>

                    {/* Reflection prompt if present */}
                    {q.reflectionPrompt && (
                      <p className="text-[11px] text-slate-400 italic mt-3 pt-3 border-t border-slate-800/80">
                        Prompt: {q.reflectionPrompt}
                      </p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(q)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedId === q.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onSelectAsCurrentQuote(q);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Show on Hero</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredQuotes.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">
              No quotes match your search criteria. Try a different query or reset filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
