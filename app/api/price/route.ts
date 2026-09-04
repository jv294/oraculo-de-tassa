import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cardName = searchParams.get('card');

  if (!cardName) {
    return NextResponse.json({ error: 'Falta o nome da carta' }, { status: 400 });
  }

  try {
    // ESQUELETO DE SCRAPING
    // Para funcionar, instale o cheerio: npm install cheerio
    
    /* 
    import * as cheerio from 'cheerio';
    
    // LigaMagic substitui espaços por + nas URLs normalmente
    const encodedName = cardName.replace(/ /g, '+');
    const url = `https://www.ligamagic.com.br/?view=cards/search&card=${encodedName}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) throw new Error('Falha ao acessar LigaMagic');
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // NOTE: O seletor abaixo é um palpite genérico ("#precomenor" ou semelhante).
    // Inspecione o HTML da LigaMagic para achar o container real do menor/médio preço.
    const priceText = $('.price-menor').first().text().trim(); 

    // Extrai e formata o numero
    const priceMatch = priceText.match(/R\$\s*(\d+(?:,\d+)?)/);
    const finalPrice = priceMatch ? priceMatch[1] : null;

    if (!finalPrice) {
      return NextResponse.json({ price: null });
    }

    return NextResponse.json({ price: finalPrice });
    */

    // Retorno mock para não quebrar enqto a dependencia não existir
    // Descomente e ative o `fetchPrice(card.name)` no IntersectionObserver 
    // no MtgCard.tsx quando tiver subido o cheerio com os seletores oficiais da LigaMagic!
    return NextResponse.json(
      { price: null, message: "Scraping end-point skeleton (Cheerio/Puppeteer requested)" }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro na extração de preço:', error);
    return NextResponse.json({ error: 'Erro ao extrair preço' }, { status: 500 });
  }
}
