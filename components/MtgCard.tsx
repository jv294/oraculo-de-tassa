import { useEffect, useRef, useState } from 'react';
import { ScryfallCard } from '@/types';
import Image from 'next/image';
import { buildLigaMagicUrl } from '@/lib/ligamagic';

interface MtgCardProps {
  card: ScryfallCard;
}

export default function MtgCard({ card }: MtgCardProps) {
  const [ligaPrice, setLigaPrice] = useState<string | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Try to find image uri either on the root or in the card faces (for double-sided)
  const imageUrl = card.image_uris?.normal || 
                   card.card_faces?.[0]?.image_uris?.normal ||
                   '';

  const ligaMagicUrl = buildLigaMagicUrl(card.name, card.printed_name);

  // Setup do IntersectionObserver para Scraping Lazy-Load (Opcional)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !ligaPrice && !isLoadingPrice) {
          // Fetch trigger lazy
          // fetchPrice(card.name); 
        }
      },
      { rootMargin: '100px' } // dispara 100px antes de entrar na tela
    );

    if (cardRef.current) observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, [card.name, ligaPrice, isLoadingPrice]);

  const fetchPrice = async (name: string) => {
    setIsLoadingPrice(true);
    try {
      const res = await fetch(`/api/price?card=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        setLigaPrice(data.price);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  return (
    <div ref={cardRef} className="group relative rounded-[4%_4%_4%_4%/3%_3%_3%_3%] transition-all duration-500 hover:scale-[1.03] sm:hover:scale-105 hover:z-20 animate-fade-in bg-thassa-900 border border-thassa-700 shadow-xl hover:shadow-[0_0_25px_rgba(217,119,6,0.2),0_15px_30px_rgba(0,0,0,0.6)] flex flex-col h-full overflow-hidden">
      
      {/* Imagem clicável encapsulada num Link apontando pro LigaMagic */}
      <a 
        href={ligaMagicUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative aspect-[63/88] w-full bg-thassa-950 flex items-center justify-center block overflow-hidden rounded-[inherit]"
      >
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={card.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized // Scryfall recommend against optimizing their images, to reduce strain
          />
        ) : (
          <div className="p-2 sm:p-4 text-center">
            <h3 className="font-serif font-bold text-sm sm:text-lg text-amber-600 drop-shadow-md">{card.name}</h3>
            <p className="text-[10px] sm:text-xs text-thassa-400 mt-1 sm:mt-2">{card.type_line}</p>
            <p className="text-[10px] sm:text-sm mt-2 sm:mt-4 italic text-thassa-200 line-clamp-4">{card.oracle_text}</p>
          </div>
        )}
        
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-thassa-900/70 via-transparent to-thassa-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[1px]">
          <span className="bg-[#0a0e1a]/95 text-amber-500 font-sans font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-amber-500/60 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] shadow-black/80 backdrop-blur-md">
            <span className="hidden sm:inline">Ver no </span>LigaMagic
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </span>
        </div>
      </a>
      
      {/* Call to action e Infos Base */}
      {/* Area removida temporariamente a pedido na iteração anterior - cards puros (edge-to-edge) agora assumem toda a glória visual */}
    </div>
  );
}
