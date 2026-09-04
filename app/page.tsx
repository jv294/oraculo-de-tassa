'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { SearchResult } from '@/types';

export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) setCollapsed(true);
  };

  return (
    <div className="min-h-screen bg-thassa-900 text-thassa-50 flex flex-col font-sans selection:bg-amber-600/30">
      
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Imagem Fantasia (Island - Theros Beyond Death - Nyx Land Art) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url('https://cards.scryfall.io/art_crop/front/0/b/0ba88516-f331-4ce8-add8-569cc2d54eec.jpg?1581481496')` }}
        ></div>

        {/* Overlays Dinâmicos para Contraste & Clima (Oceano Abissal) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/80 via-[#0a0e1a]/85 to-[#020617]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-thassa-900 via-transparent to-transparent opacity-80"></div>

        {/* Estrelas de Nyx / Fundo Noturno Cósmico */}
        <div 
          className="absolute inset-0 opacity-60 mix-blend-screen"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='rgba(251,191,36,0.15)'/%3E%3Ccircle cx='10' cy='10' r='0.5' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='50' cy='45' r='1' fill='rgba(147,197,253,0.1)'/%3E%3C/svg%3E")` }}
        ></div>
        
        {/* Correntes Submersas Ocultas (Luzes de fundo intensificadas) */}
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[30%] -right-[5%] w-[40vw] h-[50vw] bg-amber-900/20 blur-[130px] rounded-full mix-blend-screen"></div>
      </div>

      <main className={`flex-grow container mx-auto px-4 relative z-10 flex flex-col items-center w-full max-w-7xl transition-all duration-700 ${collapsed ? 'py-4 md:py-6' : 'py-10 md:py-16'}`}>
        
        {/* Header/Logo - colapsa em um header compacto ao pesquisar */}
        <header className={`w-full transition-all duration-700 ${collapsed ? 'mb-3' : 'mb-10 text-center'}`}>
          
          {/* Header Compacto (visível apenas quando colapsado) */}
          <div className={`overflow-hidden transition-all duration-700 ${collapsed ? 'max-h-16 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center justify-between gap-4 px-2">
              <h2 className="font-serif text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-amber-200 whitespace-nowrap">
                Oráculo de Tassa
              </h2>
              <div className="w-16 md:w-32 h-[2px] bg-gradient-to-r from-amber-500/60 to-transparent"></div>
            </div>
          </div>

          {/* Hero Grande (colapsa para fora) */}
          <div className={`grid transition-all duration-700 ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
            <div className="overflow-hidden">
              {/* Filigrana Suprema (Decoração) */}
              <div className="flex justify-center items-center gap-4 mb-6 opacity-70">
                <div className="w-16 md:w-32 h-[2px] bg-gradient-to-r from-transparent to-amber-500/80"></div>
                <div className="w-3 h-3 rotate-45 border border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <div className="w-16 md:w-32 h-[2px] bg-gradient-to-l from-transparent to-amber-500/80"></div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-amber-200 drop-shadow-sm mb-4 tracking-tight" style={{ textWrap: 'balance' }}>
                Oráculo de Tassa
              </h1>
              <p className="text-thassa-300 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
                Consulte as profundezas para descobrir os cards e sinergias que você procura.
              </p>
              
              {/* Fechamento Filigrana */}
              <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mx-auto mt-8"></div>
            </div>
          </div>
        </header>

        {/* Search App */}
        <div className="w-full max-w-5xl mx-auto">
          {/* Fica "grudado" no topo quando colapsado, funcionando como header */}
          <div className={`transition-all duration-700 ${collapsed ? 'sticky top-0 z-30 pt-3 pb-2' : ''}`}>
            <SearchBar onSearchResult={setResult} onLoading={handleLoading} collapsed={collapsed} />
          </div>
          {!loading && <SearchResults results={result} />}
        </div>
      </main>

      <footer className="py-6 text-center text-thassa-500 text-sm border-t border-thassa-800/50 backdrop-blur pb-8 relative z-10">
        <p>© 2026 Oráculo de Tassa. Não afiliado com Wizards of the Coast.</p>
        <p className="mt-1">Poderizado por Scryfall & IA.</p>
      </footer>
    </div>
  );
}
