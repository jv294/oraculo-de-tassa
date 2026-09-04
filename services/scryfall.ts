import { ScryfallCard } from '../types';

const SCRYFALL_API_URL = 'https://api.scryfall.com';

/**
 * Busca cartas usando a sintaxe de query do Scryfall
 */
export async function searchScryfallByQuery(query: string): Promise<ScryfallCard[]> {
  if (!query) return [];
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${SCRYFALL_API_URL}/cards/search?q=${encodedQuery}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'OraculoDeTassa/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Nenhum resultado encontrado
      }
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Scryfall search error:', error);
    throw error;
  }
}

/**
 * Busca múltiplas cartas específicas por nome (útil para combos)
 */
export async function searchScryfallByNames(names: string[]): Promise<ScryfallCard[]> {
  if (!names || names.length === 0) return [];

  try {
    // Scryfall API permite buscar coleções (max 75 cartas)
    const identifiers = names.map(name => ({ name }));
    
    const response = await fetch(`${SCRYFALL_API_URL}/cards/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifiers }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Scryfall API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Scryfall collection search error:', error);
    throw error;
  }
}
