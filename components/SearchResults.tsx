'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult } from '@/types';
import MtgCard from './MtgCard';

export default function SearchResults({ results }: { results: SearchResult | null }) {
  const [visibleCount, setVisibleCount] = useState(20);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reseta o contador sempre que houver uma nova busca
  useEffect(() => {
    setVisibleCount(20);
  }, [results]);

  // IntersectionObserver para Infinite Scroll
  useEffect(() => {
    if (!results || results.data.length <= visibleCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Adiciona mais 10 cartas a cada vez que o alvo entrar na tela
          setVisibleCount((prev) => Math.min(prev + 10, results.data.length));
        }
      },
      { rootMargin: '200px' } // Ativa quando chegar a 200px do final
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [results, visibleCount]);

  if (!results) return null;

  // Define Empty State ou erro de rede
  const isEmpty = results.data.length === 0 || results.error;
  
  // Corta as cartas na quantia atual visível
  const visibleCards = results.data.slice(0, visibleCount);

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
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 w-full mx-auto px-1">
            {visibleCards.map((card, idx) => (
              <MtgCard key={`${card.id}-${idx}`} card={card} />
            ))}
          </div>
          
          {/* Elemento alvo invisível no fim do grid que trigga o infinite scroll */}
          {visibleCount < results.data.length && (
            <div ref={observerTarget} className="w-full h-20 mt-4 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-thassa-600 border-t-amber-500 rounded-full animate-spin shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            </div>
          )}
          
          {/* Total Encontrado Indicator */}
          <div className="text-center mt-12 text-thassa-400 font-sans text-sm">
            Exibindo {visibleCards.length} de {results.data.length} cartas reveladas.
          </div>
        </>
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
