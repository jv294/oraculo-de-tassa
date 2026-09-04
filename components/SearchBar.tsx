'use client';

import { useState } from 'react';
import { SearchResult } from '@/types';

interface SearchBarProps {
  onSearchResult: (result: SearchResult) => void;
  onLoading: (isLoading: boolean) => void;
  collapsed?: boolean;
}

export default function SearchBar({ onSearchResult, onLoading, collapsed = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onLoading(true);
    setLoading(true);
    
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query.trim() }),
      });

      if (!response.ok) {
        // Tenta ler o JSON de erro. Se a resposta não for JSON (ex: HTML de erro 500),
        // usa uma mensagem genérica para não quebrar o fluxo.
        let errorMessage = 'Erro desconhecido da entidade cósmica';
        try {
          const errorData = await response.json();
          errorMessage = errorData.explanation || errorData.error || errorMessage;
        } catch {
          // Resposta não é JSON — mantém a mensagem genérica
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      onSearchResult(data as SearchResult);
    } catch (error: any) {
      console.error(error);
      onSearchResult({
        query: "",
        data: [],
        error: true,
        explanation: 'As ondas agitadas bloqueiam minha visão. Erro: ' + error.message,
      });
    } finally {
      onLoading(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full max-w-3xl mx-auto relative animate-fade-in group px-4 sm:px-0 z-20 transition-all duration-500 ${collapsed ? 'my-2' : 'my-8'}`}>
      <div className={`relative flex flex-row items-stretch bg-[#050811]/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-thassa-700/90 focus-within:border-amber-500/70 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all duration-500 ${collapsed ? 'max-w-2xl mx-auto' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Descreva seu desejo (Ex: Magica azul que compra 2 cartas)"
          className={`flex-1 min-w-0 w-full bg-transparent text-white placeholder-thassa-400 focus:outline-none font-sans transition-all duration-500 ${collapsed ? 'py-2.5 px-4 text-sm sm:text-base' : 'py-4 px-6 text-base sm:text-lg'}`}
          disabled={false}
        />
        
        {/* Divisor Visual para não vazar a caixa com botão */}
        <div className={`w-[1px] self-center bg-thassa-700/50 transition-all duration-500 ${collapsed ? 'h-7' : 'h-10'}`}></div>

        <button
          type="submit"
          className={`shrink-0 bg-gradient-to-r from-thassa-700/80 to-thassa-600 hover:from-thassa-600 hover:to-thassa-500 text-amber-50 hover:text-white font-serif transition-all duration-300 font-bold tracking-wider active:bg-thassa-800 ${collapsed ? 'min-w-[100px] px-4 py-2.5 text-sm' : 'min-w-[140px] px-6 py-4 sm:px-8 sm:py-5'}`}
        >
          Consultar
        </button>
      </div>

      {/* Loading indicator - místico */}
      {loading && (
        <div className="my-10 md:my-16 flex flex-col items-center justify-center gap-8 z-10">
          {/* Orbe Místico Flutuante */}
          <div className="relative w-24 h-24">
            {/* Aura Externa Pulsante */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
            {/* Halo Dourado Giratório */}
            <div className="absolute inset-2 rounded-full border-2 border-amber-400/40 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
            </div>
            {/* Orbe Central */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.6),0_0_50px_rgba(245,158,11,0.3),inset_0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
              {/* Brilho interno */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
            </div>
            {/* Partículas Flutuantes (Poeira Estelar) */}
            <div className="absolute w-1 h-1 bg-amber-300 rounded-full animate-float-1 shadow-[0_0_4px_rgba(251,191,36,0.8)]" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-amber-200 rounded-full animate-float-2 shadow-[0_0_4px_rgba(251,191,36,0.8)]" style={{ top: '60%', left: '10%', animationDelay: '0.5s' }}></div>
            <div className="absolute w-1 h-1 bg-amber-400 rounded-full animate-float-3 shadow-[0_0_4px_rgba(251,191,36,0.8)]" style={{ top: '30%', right: '10%', animationDelay: '1s' }}></div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-amber-400/90 font-serif italic text-lg animate-pulse">
              Thassa perscruta as correntes marítimas...
            </p>
            <p className="text-thassa-400/60 text-xs font-sans italic">
              Descobrindo os segredos das profundezas
            </p>
          </div>
        </div>
      )}
    </form>
  );
}