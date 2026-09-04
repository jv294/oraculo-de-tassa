export interface ScryfallCard {
  id: string;
  name: string;
  printed_name?: string;
  mana_cost: string;
  type_line: string;
  oracle_text?: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
  };
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    name: string;
    mana_cost: string;
    type_line: string;
    oracle_text: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
  scryfall_uri: string;
  rarity: string;
  set_name: string;
}

export interface OracleResponse {
  query: string;
  type: 'syntax' | 'names' | 'combo'; // syntax = scryfall query syntax, names = exact card names, combo = combo description
  explanation: string;
}

export interface SearchResult {
  query: string;
  data: ScryfallCard[];
  error: boolean;
  explanation?: string;
}
