'use client';

import { SearchResult } from '@/types';
import MtgCard from './MtgCard';

export default function SearchResults({ results }: { results: SearchResult | null }) {
  if (!results) return null;

  // Define Empty State ou erro de rede
  const isEmpty = results.data.length === 0 || results.error;

  return (
    <div className="w-full mt-12 animate-fade-in">
      {results.query && (
        <div className="bg-gradient-to-b from-thassa-800/60 to-thassa-900/60 border border-thassa-700/80 rounded-xl p-5 mb-8 md:mb-12 text-center max-w-2xl mx-auto shadow-xl shadow-black/20 backdrop-blur-md">
          <p className="font-serif text-base md:text-lg text-thassa-200 italic tracking-wide">
            O Oráculo procurou cartas com os parâmetros: [{results.query}]
          </p>
        </div>
      )}

      {results.error && results.explanation && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-5 mb-8 text-center text-red-300 max-w-2xl mx-auto backdrop-blur-sm">
          <p>{results.explanation}</p>
        </div>
      )}

      {!isEmpty ? (
        // Grid Otimizado para Mobile (Pequeno e Médio - Cartas pareadas ao inves de soltas)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 w-full mx-auto px-1">
          {results.data.map((card, idx) => (
            <MtgCard key={`${card.id}-${idx}`} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 font-serif">
          <p className="text-thassa-400/80 text-lg md:text-xl italic">
            "Nenhuma carta encontrada nas profundezas do oceano que corresponda a este pedido."
          </p>
        </div>
      )}
    </div>
  );
}
