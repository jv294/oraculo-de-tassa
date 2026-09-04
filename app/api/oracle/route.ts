import { NextRequest, NextResponse } from 'next/server';
import { processPromptWithOpenRouter } from '@/services/openrouter';
import { searchScryfallByQuery } from '@/services/scryfall';
import { SearchResult } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Um prompt válido é obrigatório' },
        { status: 400 }
      );
    }

    // 1. O OpenRouter funciona como tradutor puro
    const scryfallQueryFormat = await processPromptWithOpenRouter(prompt);

    // 2. Tenta buscar no scryfall
    let cards = [];
    let hasError = false;
    
    try {
      cards = await searchScryfallByQuery(scryfallQueryFormat);
    } catch (e) {
      console.error('Erro na chamada ao Scryfall:', e);
      hasError = true;
    }
    
    // Retorna string gerada SEMPRE
    const result: SearchResult = {
      query: scryfallQueryFormat,
      data: cards, // Envia todas as cartas (até 175 default da scryfall), o frontend cuida do lazy load scroll
      error: hasError || cards.length === 0,
    };
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/oracle Error:', error);
    
    // Retorna 200 com error flag para o frontend renderizar a mensagem temática
    // sem quebrar a aplicação (sem resposta 500 que quebra o parsing do JSON do frontend).
    const fallbackResult: SearchResult = {
      query: "",
      data: [],
      error: true,
      explanation: error.message || 'Houve um erro no processamento do oráculo.',
    };
    
    return NextResponse.json(fallbackResult);
  }
}
